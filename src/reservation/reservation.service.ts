import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  create(reservation: CreateReservationDto, userId) {
    const { flightId, tickets } = reservation;
    const seatNumbers = tickets.map((ticket) => ticket.seatNumber);

    return this.prisma.$transaction(async (tx) => {
      const flight = await tx.flight.findUnique({ where: { id: flightId } });
      if (!flight) {
        throw new NotFoundException(`Flight with ID ${flightId} not found.`);
      }

      // Verifica se os assentos estão ocupados por outros usuários (não por ele mesmo)
      const existingTickets = await tx.ticket.findMany({
        where: {
          seatNumber: { in: seatNumbers },
          reservation: {
            flightId: flightId,
            status: { in: ['PENDING', 'CONFIRMED'] },
            userId: { not: userId }, // Permite seus próprios PENDING/CONFIRMED
          },
        },
      });

      if (existingTickets.length > 0) {
        const takenSeats = existingTickets.map((t) => t.seatNumber);
        throw new ConflictException(
          `The following seats are already taken: ${takenSeats.join(', ')}`,
        );
      }

      const reservation = await tx.reservation.create({
        data: {
          flightId,
          userId,
          status: ReservationStatus.PENDING,
          reservationNumber: `RES-${Date.now()}-${flightId}`,
          totalPrice: 0,
          tickets: {
            create: tickets,
          },
        },
        include: {
          tickets: true,
        },
      });

      // Mark seats as unavailable
      await tx.seat.updateMany({
        where: {
          flightId,
          seatNumber: { in: seatNumbers },
        },
        data: {
          isAvailable: false,
        },
      });

      return reservation;
    });
  }

  findAllByUser(userId: number) {
    return this.prisma.reservation.findMany({
      where: { userId },
      include: {
        flight: {
          include: {
            originAirport: true,
            destinationAirport: true,
          },
        },
        tickets: true,
        payment: true,
      },
      orderBy: {
        bookingDate: 'desc',
      },
    });
  }

  async findOneByUser(id: number, userId: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        flight: true,
        tickets: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found.`);
    }

    if (reservation.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to view this reservation.',
      );
    }

    return reservation;
  }

  async cancel(id: number, userId: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { flight: true, tickets: true },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found.`);
    }
    if (reservation.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to cancel this reservation.',
      );
    }
    if (reservation.status === 'CANCELLED') {
      throw new ConflictException(
        'This reservation has already been cancelled.',
      );
    }

    const now = new Date();
    const departureTime = new Date(reservation.flight.departureDateTime);
    const hoursDifference =
      (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      throw new ForbiddenException(
        'Reservations can only be cancelled at least 24 hours before departure.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Update reservation status
      const updatedReservation = await tx.reservation.update({
        where: { id },
        data: {
          status: ReservationStatus.CANCELLED,
        },
      });

      // Mark seats as available again
      const seatNumbers = reservation.tickets.map(
        (ticket) => ticket.seatNumber,
      );
      await tx.seat.updateMany({
        where: {
          flightId: reservation.flightId,
          seatNumber: { in: seatNumbers },
        },
        data: {
          isAvailable: true,
        },
      });

      return updatedReservation;
    });
  }
}
