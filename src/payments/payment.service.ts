import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  PaymentMethod,
  PaymentStatus,
  ReservationStatus,
} from '@prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async processPayment(
    reservationId: number,
    userId: number,
    createPaymentDto: CreatePaymentDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id: reservationId },
        include: { flight: true, payment: true },
      });

      if (!reservation) {
        throw new NotFoundException(
          `Reservation with ID ${reservationId} not found.`,
        );
      }
      if (reservation.userId !== userId) {
        throw new ForbiddenException(
          'You are not authorized to pay for this reservation.',
        );
      }
      if (reservation.status !== ReservationStatus.PENDING) {
        throw new ConflictException('This reservation is not pending payment.');
      }
      if (reservation.payment) {
        throw new ConflictException(
          'A payment has already been initiated for this reservation.',
        );
      }

      const { method } = createPaymentDto;

      if (method === PaymentMethod.CREDIT_CARD) {
        // Validate credit card fields
        if (!createPaymentDto.cardType || !createPaymentDto.cardNumber) {
          throw new BadRequestException(
            'Card type and card number are required for credit card payments.',
          );
        }

        await tx.reservation.update({
          where: { id: reservationId },
          data: { status: ReservationStatus.CONFIRMED },
        });

        return tx.payment.create({
          data: {
            reservationId,
            method,
            status: PaymentStatus.APPROVED,
            processedAt: new Date(),
            cardType: createPaymentDto.cardType,
            cardLastFourDigits: createPaymentDto.cardNumber?.slice(-4),
            cardExpiryDate: createPaymentDto.cardExpiryDate,
          },
        });
      }

      if (method === PaymentMethod.BANK_SLIP) {
        const now = new Date();
        const departure = new Date(reservation.flight.departureDateTime);
        const diffInDays =
          (departure.getTime() - now.getTime()) / (1000 * 3600 * 24);

        if (diffInDays <= 3) {
          throw new BadRequestException(
            'Bank slip payments are only available for flights more than 3 days away.',
          );
        }

        const slipExpiryDate = new Date();
        slipExpiryDate.setDate(slipExpiryDate.getDate() + 2);

        // Para fins de teste, aprovar automaticamente o boleto
        await tx.reservation.update({
          where: { id: reservationId },
          data: { status: ReservationStatus.CONFIRMED },
        });

        return tx.payment.create({
          data: {
            reservationId,
            method,
            status: PaymentStatus.APPROVED, // Aprovado automaticamente para teste
            processedAt: new Date(),
            slipBarcode: `${this.generateBankSlipBarcode()}`,
            slipExpiryDate,
          },
        });
      }

      throw new BadRequestException('Invalid payment method.');
    });
  }

  private generateBankSlipBarcode(): string {
    // Gera um código de barras fake mais realista (47 dígitos - padrão brasileiro)
    const bankCode = String(Math.floor(Math.random() * 900) + 1).padStart(
      3,
      '0',
    );
    const sequence = String(Math.floor(Math.random() * 9999999)).padStart(
      7,
      '0',
    );
    const timestamp = Date.now().toString().slice(-10);
    const random = String(Math.floor(Math.random() * 999)).padStart(3, '0');

    return `${bankCode}${sequence}${timestamp}${random}`;
  }
}
