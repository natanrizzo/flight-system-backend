import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AirportModule } from './airport/airport.module';
import { AircraftModule } from './aircraft/aircraft.module';
import { EmployeeModule } from './employee/employee.module';
import { FlightModule } from './flight/flight.module';
import { ReservationModule } from './reservation/reservation.module';
import { PaymentModule } from './payments/payment.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    AirportModule,
    AircraftModule,
    EmployeeModule,
    FlightModule,
    ReservationModule,
    PaymentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
