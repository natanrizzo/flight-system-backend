import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateFlightTypeDto } from './dto/update-flight-type.dto';
import { CreateFlightTypeDto } from './dto/create-flight-type.dto';
import { CreateFlightDto } from './dto/create-flight.dto';
import { SearchFlightDto } from './dto/search-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightStatus, ReservationStatus } from '@prisma/client';

@Injectable()
export class FlightService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSeatNumbers(seatMap: any, seatCapacity: number): string[] {
    const seats: string[] = [];
    const defaultColumns = ['A', 'B', 'C', 'D', 'E', 'F'];

    // If seatMap exists and has structure, use it
    if (seatMap && seatMap.rows) {
      const rows = seatMap.rows;
      // Ensure columns is an array
      let columns = defaultColumns;
      if (seatMap.columns) {
        if (Array.isArray(seatMap.columns)) {
          columns = seatMap.columns;
        } else if (typeof seatMap.columns === 'string') {
          // If it's a string like "ABCDEF", split it into array
          columns = seatMap.columns.split('');
        }
      }

      for (let i = 1; i <= rows; i++) {
        for (const column of columns) {
          seats.push(`${i}${column}`);
        }
      }
    } else {
      // Fallback: generate seats based on capacity
      // Assume 6 seats per row (A-F)
      const seatsPerRow = 6;
      const rows = Math.ceil(seatCapacity / seatsPerRow);

      for (let i = 1; i <= rows; i++) {
        for (let j = 0; j < seatsPerRow && seats.length < seatCapacity; j++) {
          seats.push(`${i}${defaultColumns[j]}`);
        }
      }
    }

    return seats.slice(0, seatCapacity);
  }

  async createFlight(flight: CreateFlightDto) {
    const { stopovers, crewMemberIds, ...flightData } = flight;

    return await this.prisma.$transaction(async (tx) => {
      const createdFlight = await tx.flight.create({
        data: {
          ...flightData,
          departureDateTime: new Date(flightData.departureDateTime),
          arrivalDateTime: new Date(flightData.arrivalDateTime),
        },
        include: {
          flightType: true,
          aircraft: {
            include: {
              aircraftType: true,
            },
          },
          originAirport: true,
          destinationAirport: true,
        },
      });

      // Create seats for the flight
      const aircraft = await tx.aircraft.findUnique({
        where: { id: flightData.aircraftId },
        include: { aircraftType: true },
      });

      if (aircraft) {
        const seatNumbers = this.generateSeatNumbers(
          aircraft.aircraftType.seatMap,
          aircraft.aircraftType.seatCapacity,
        );

        await tx.seat.createMany({
          data: seatNumbers.map((seatNumber) => ({
            flightId: createdFlight.id,
            seatNumber,
            isAvailable: true,
          })),
        });
      }

      if (stopovers && stopovers.length > 0) {
        await tx.stopover.createMany({
          data: stopovers.map((stopover) => ({
            ...stopover,
            flightId: createdFlight.id,
            arrivalDateTime: new Date(stopover.arrivalDateTime),
            departureDateTime: new Date(stopover.departureDateTime),
          })),
        });
      }

      if (crewMemberIds && crewMemberIds.length > 0) {
        await tx.flightCrew.createMany({
          data: crewMemberIds.map((employeeId) => ({
            flightId: createdFlight.id,
            employeeId: employeeId,
          })),
        });
      }

      return await tx.flight.findUnique({
        where: { id: createdFlight.id },
        include: {
          flightType: true,
          aircraft: {
            include: {
              aircraftType: true,
            },
          },
          originAirport: true,
          destinationAirport: true,
          stopovers: {
            include: {
              airport: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
          crewMembers: {
            include: {
              employee: true,
            },
          },
        },
      });
    });
  }

  async searchFlights(searchParams: SearchFlightDto) {
    const { originAirportCode, destinationAirportCode, departureDate } =
      searchParams;

    const [originAirport, destinationAirport] = await Promise.all([
      this.prisma.airport.findFirst({
        where: { code: originAirportCode },
      }),
      this.prisma.airport.findFirst({
        where: { code: destinationAirportCode },
      }),
    ]);

    if (!originAirport) {
      throw new Error(
        `Origin airport with code '${originAirportCode}' not found`,
      );
    }

    if (!destinationAirport) {
      throw new Error(
        `Destination airport with code '${destinationAirportCode}' not found`,
      );
    }

    const searchDate = new Date(departureDate);
    const startOfDay = new Date(searchDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(searchDate);
    endOfDay.setHours(23, 59, 59, 999);

    const now = new Date();

    return await this.prisma.flight.findMany({
      where: {
        originAirportId: originAirport.id,
        destinationAirportId: destinationAirport.id,
        departureDateTime: {
          gte: startOfDay,
          lte: endOfDay,
          gt: now,
        },
        status: FlightStatus.ACTIVE,
      },
      include: {
        flightType: true,
        aircraft: {
          include: {
            aircraftType: true,
          },
        },
        originAirport: true,
        destinationAirport: true,
        stopovers: {
          include: {
            airport: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        crewMembers: {
          include: {
            employee: true,
          },
        },
      },
      orderBy: {
        departureDateTime: 'asc',
      },
    });
  }

  async findPublicById(id: number) {
    const flight = await this.prisma.flight.findFirst({
      where: { 
        id,
        status: FlightStatus.ACTIVE,
      },
      include: {
        originAirport: true,
        destinationAirport: true,
        stopovers: {
          include: { airport: true },
          orderBy: { order: 'asc' },
        },
        aircraft: { include: { aircraftType: true } },
      },
    });

    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found.`);
    }

    return flight;
  }

  getSeatMap(flightId: number) {
    return this.prisma.flight.findFirst({
      where: { 
        id: flightId,
        status: FlightStatus.ACTIVE,
      },
      include: {
        aircraft: {
          include: {
            aircraftType: true,
          },
        },
        seats: {
          orderBy: {
            seatNumber: 'asc',
          },
        },
      },
    });
  }

  findAllAdmin() {
    return this.prisma.flight.findMany({
      where: {
        status: { not: FlightStatus.CANCELLED },
      },
      include: {
        flightType: true,
        aircraft: {
          include: {
            aircraftType: true,
          },
        },
        originAirport: true,
        destinationAirport: true,
        stopovers: {
          include: {
            airport: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        crewMembers: {
          include: {
            employee: true,
          },
        },
        seats: {
          select: {
            id: true,
            seatNumber: true,
            isAvailable: true,
          },
        },
      },
      orderBy: { departureDateTime: 'desc' },
    });
  }

  async findAdminById(id: number) {
    const flight = await this.prisma.flight.findUnique({
      where: { id },
      include: {
        originAirport: true,
        destinationAirport: true,
        stopovers: { include: { airport: true } },
        crewMembers: { include: { employee: true } },
        aircraft: { include: { aircraftType: true } },
        flightType: true,
      },
    });
    if (!flight) {
      throw new NotFoundException(`Flight with ID ${id} not found.`);
    }
    return flight;
  }

  async updateFlight(id: number, updateFlightDto: UpdateFlightDto) {
    await this.findAdminById(id);

    const {
      aircraftId,
      crewMemberIds,
      destinationAirportId,
      flightTypeId,
      originAirportId,
      stopovers,
      ...updateData
    } = updateFlightDto;

    return this.prisma.flight.update({
      where: { id },
      data: {
        ...updateData,
      },
    });
  }

  async removeFlight(id: number) {
    await this.findAdminById(id);

    return this.prisma.$transaction(async (tx) => {
      // Get all reservations for this flight
      const reservations = await tx.reservation.findMany({
        where: { 
          flightId: id,
          status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] }
        },
        include: {
          tickets: true,
        },
      });

      // Cancel all reservations for this flight
      if (reservations.length > 0) {
        await tx.reservation.updateMany({
          where: {
            flightId: id,
            status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
          },
          data: {
            status: ReservationStatus.CANCELLED,
          },
        });

        // Mark all seats as available since the flight is cancelled
        const seatNumbers = reservations.flatMap((reservation) =>
          reservation.tickets.map((ticket) => ticket.seatNumber),
        );

        if (seatNumbers.length > 0) {
          await tx.seat.updateMany({
            where: {
              flightId: id,
              seatNumber: { in: seatNumbers },
            },
            data: {
              isAvailable: true,
            },
          });
        }
      }

      // Mark the flight as cancelled instead of deleting
      return tx.flight.update({
        where: { id },
        data: {
          status: FlightStatus.CANCELLED,
        },
      });
    });
  }

  createFlightType(flightType: CreateFlightTypeDto) {
    return this.prisma.flightType.create({
      data: flightType,
    });
  }

  getAllFlightTypes() {
    return this.prisma.flight.findMany();
  }

  getOneByIdFlightType(id: number) {
    return this.prisma.flight.findUnique({
      where: { id },
    });
  }

  updateFlightType(id: number, flightType: UpdateFlightTypeDto) {
    return this.prisma.flightType.update({
      where: { id },
      data: flightType,
    });
  }

  deleteFlightType(id: number) {
    return this.prisma.flight.delete({
      where: { id },
    });
  }
}
