import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  passengerName: string;

  @IsString()
  @IsNotEmpty()
  seatNumber: string; // ex.: "12A"
}