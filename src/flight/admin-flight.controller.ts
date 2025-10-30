import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FlightService } from "./flight.service";
import { CreateFlightDto } from "./dto/create-flight.dto";
import { UpdateFlightDto } from "./dto/update-flight.dto";
import { UpdateFlightTypeDto } from "./dto/update-flight-type.dto";
import { CreateFlightTypeDto } from "./dto/create-flight-type.dto";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("Admin Flights")
@Roles(UserRole.MAINTAINER)
@Controller("admin")
export class AdminFlightController {
    constructor(
        private readonly service: FlightService
    ) {}

    @ApiOperation({ summary: "Create a new flight" })
    @ApiResponse({ status: 201, description: "Flight created successfully" })
    @Post("flights")
    createFlight(
        @Body() flight: CreateFlightDto
    ) {
        return this.service.createFlight(flight);
    }

    @ApiOperation({ summary: "Get all flights (admin view)" })
    @ApiResponse({ status: 200, description: "List of all flights" })
    @Get("flights")
    findAllFlights() {
        return this.service.findAllAdmin();
    }

    @ApiOperation({ summary: "Get a flight by ID (admin view)" })
    @ApiResponse({ status: 200, description: "Flight details" })
    @ApiResponse({ status: 404, description: "Flight not found" })
    @Get("flights/:id")
    findOneFlight(
        @Param("id") id: number
    ) {
        return this.service.findAdminById(id);
    }

    @ApiOperation({ summary: "Update a flight by ID" })
    @ApiResponse({ status: 200, description: "Flight updated successfully" })
    @ApiResponse({ status: 404, description: "Flight not found" })
    @Put("flights/:id")
    updateFlight(
        @Param("id") id: number,
        @Body() updateFlight: UpdateFlightDto
    ) {
        return this.service.updateFlight(id, updateFlight);
    }

    @ApiOperation({ summary: "Delete a flight by ID" })
    @ApiResponse({ status: 200, description: "Flight deleted successfully" })
    @ApiResponse({ status: 404, description: "Flight not found" })
    @Delete("flights/:id")
    removeFlight(
        @Param("id") id: number
    ) {
        return this.service.removeFlight(id);
    }

    @ApiOperation({ summary: "Create a new flight type" })
    @ApiResponse({ status: 201, description: "Flight type created successfully" })
    @Post('flight-types')
    createFlightType(@Body() createFlightTypeDto: CreateFlightTypeDto) {
        return this.service.createFlightType(createFlightTypeDto);
    }

    @ApiOperation({ summary: "Get all flight types" })
    @ApiResponse({ status: 200, description: "List of all flight types" })
    @Get('flight-types')
    findAllFlightTypes() {
        return this.service.getAllFlightTypes();
    }

    @ApiOperation({ summary: "Update a flight type by ID" })
    @ApiResponse({ status: 200, description: "Flight type updated successfully" })
    @ApiResponse({ status: 404, description: "Flight type not found" })
    @Put('flight-types/:id')
    updateFlightType(
        @Param('id') id: number,
        @Body() updateFlightTypeDto: UpdateFlightTypeDto,
    ) {
        return this.service.updateFlightType(id, updateFlightTypeDto);
    }

    @ApiOperation({ summary: "Delete a flight type by ID" })
    @ApiResponse({ status: 200, description: "Flight type deleted successfully" })
    @ApiResponse({ status: 404, description: "Flight type not found" })
    @Delete('flight-types/:id')
    removeFlightType(@Param('id') id: number) {
        return this.service.deleteFlightType(id);
    }
}