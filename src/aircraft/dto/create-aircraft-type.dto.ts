import {
    IsString,
    IsNotEmpty,
    IsInt,
    IsPositive,
    IsOptional,
    IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAircraftTypeDto {
    @ApiProperty({
        description: 'The model of the aircraft type',
        example: 'Boeing 737',
    })
    @IsString()
    @IsNotEmpty()
    model: string;

    @ApiPropertyOptional({
        description: 'A brief description of the aircraft type',
        example: 'A popular narrow-body aircraft.',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'The seating capacity of the aircraft type',
        example: 180,
    })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    seatCapacity: number;

    @ApiProperty({
        description: 'The seat map configuration of the aircraft type',
        example: { rows: 30, columns: 6 },
    })
    @IsObject()
    @IsNotEmpty()
    seatMap: object;
}