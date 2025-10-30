import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAircraftDto {
  @ApiProperty({
    description: 'The registration number of the aircraft',
    example: 'ABC123',
  })
  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @ApiProperty({
    description: 'The ID of the aircraft type',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  aircraftTypeId: number;
}