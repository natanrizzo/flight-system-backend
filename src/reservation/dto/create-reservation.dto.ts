import {
    IsInt,
    IsPositive,
    IsNotEmpty,
    IsArray,
    ValidateNested,
    ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';

export class CreateReservationDto {
    @ApiProperty({
        description: "The ID of the flight for the reservation",
        example: 1,
    })
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    flightId: number;

    @ApiProperty({
        description: "The list of tickets for the reservation",
        type: [CreateTicketDto],
        example: [
            { passengerName: "John Doe", seatNumber: "12A" },
            { passengerName: "Jane Doe", seatNumber: "12B" },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => CreateTicketDto)
    tickets: CreateTicketDto[];
}