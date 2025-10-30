import {
    IsString,
    IsNotEmpty,
    IsDateString,
    Length,
    IsUppercase,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchFlightDto {
    /**
     * The 3-letter IATA code of the origin airport.
     * @example 'GRU'
     */
    @ApiProperty({
        description: "The 3-letter IATA code of the origin airport",
        example: "GRU",
    })
    @IsString()
    @IsNotEmpty()
    @IsUppercase()
    @Length(3, 3, { message: 'Origin airport code must be exactly 3 characters' })
    @Transform(({ value }) => value.toUpperCase())
    originAirportCode: string;

    /**
     * The 3-letter IATA code of the destination airport.
     * @example 'JFK'
     */
    @ApiProperty({
        description: "The 3-letter IATA code of the destination airport",
        example: "JFK",
    })
    @IsString()
    @IsNotEmpty()
    @IsUppercase()
    @Length(3, 3, { message: 'Destination airport code must be exactly 3 characters' })
    @Transform(({ value }) => value.toUpperCase())
    destinationAirportCode: string;

    /**
     * The desired departure date in YYYY-MM-DD format.
     * The search will find all flights on this specific day.
     * @example '2025-12-25'
     */
    @ApiProperty({
        description: "The desired departure date in YYYY-MM-DD format",
        example: "2025-12-25",
    })
    @IsDateString()
    @IsNotEmpty()
    departureDate: string;
}