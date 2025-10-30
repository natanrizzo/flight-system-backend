import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFlightTypeDto {
  @ApiProperty({ description: "The code of the flight type", example: "ECON" })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: "The description of the flight type", example: "Economy Class", required: false })
  @IsString()
  @IsOptional()
  description?: string;
}