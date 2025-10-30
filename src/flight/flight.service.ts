import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateFlightTypeDto } from './dto/update-flight-type.dto';
import { CreateFlightTypeDto } from './dto/create-flight-type.dto';
import { CreateFlightDto } from './dto/create-flight.dto';
import { SearchFlightDto } from './dto/search-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Injectable()
export class FlightService {
  constructor(private readonly prisma: PrismaService) {}

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

    return await this.prisma.flight.findMany({
      where: {
        originAirportId: originAirport.id,
        destinationAirportId: destinationAirport.id,
        departureDateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
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
    const flight = await this.prisma.flight.findUnique({
      where: { id },
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
    return this.prisma.flight.findUnique({
      where: { id: flightId },
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

    return this.prisma.flight.delete({ where: { id } });
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
