import { Body, Controller, Get, Param, Post, Request } from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";


@ApiTags('Reservations')
@ApiBearerAuth()
@Controller("reservations")
@Roles(UserRole.PASSENGER)
export class ReservationController {
    constructor(
        private readonly service: ReservationService
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new reservation' })
    @ApiBody({ type: CreateReservationDto, description: 'Reservation details' })
    create(
        @Body() reservation: CreateReservationDto,
        @Request() req
    ) {
        const userId = req.user.id;
        return this.service.create(reservation, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all reservations for the authenticated user' })
    findAll(@Request() req) {
        const userId = req.user.id;
        return this.service.findAllByUser(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific reservation by ID for the authenticated user' })
    @ApiParam({ name: 'id', type: Number, description: 'Reservation ID' })
    @ApiOperation({ summary: 'Get all reservations for the authenticated user' })
    findOne(
        @Param('id') id: number,
        @Request() req
    ) {
        const userId = req.user.id;
        return this.service.findOneByUser(id, userId);
    }

    @Post(':id/cancel')
    @ApiOperation({ summary: 'Cancel a reservation by ID for the authenticated user' })
    @ApiParam({ name: 'id', type: Number, description: 'Reservation ID' })
    cancel(@Param('id') id: number, @Request() req) {
        const userId = req.user.id;
        return this.service.cancel(id, userId);
    }
}