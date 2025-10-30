import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsInt,
  IsPositive,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateStopoverDto } from './create-stopover.dto';

export class CreateFlightDto {
  @ApiProperty({ description: 'The flight number', example: 'AA123' })
  @IsString()
  @IsNotEmpty()
  flightNumber: string;

  @ApiProperty({
    description: 'The departure date and time',
    example: '2025-12-25T10:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  departureDateTime: Date;

  @ApiProperty({
    description: 'The arrival date and time',
    example: '2025-12-25T14:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  arrivalDateTime: Date;

  @ApiProperty({
    description: 'The estimated duration in minutes',
    example: 240,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  estimatedDurationMinutes: number;

  @ApiProperty({ description: 'The ID of the flight type', example: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  flightTypeId: number;

  @ApiProperty({ description: 'The ID of the aircraft', example: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  aircraftId: number;

  @ApiProperty({ description: 'The ID of the origin airport', example: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  originAirportId: number;

  @ApiProperty({ description: 'The ID of the destination airport', example: 2 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  destinationAirportId: number;

  @ApiProperty({
    description: 'The list of stopovers',
    type: [CreateStopoverDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStopoverDto)
  @IsOptional()
  stopovers?: CreateStopoverDto[];

  @ApiProperty({
    description: 'The list of crew member IDs',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @IsNotEmpty()
  crewMemberIds: number[];
}
