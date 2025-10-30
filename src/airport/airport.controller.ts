import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AirportService } from "./airport.service";
import { CreateAirportDto } from "./dto/create-airport.dto";
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("Airport")
@Controller("admin/airport")
export class AirportController {
    constructor(
        private readonly service: AirportService
    ) {}

    @ApiOperation({ summary: "Create a new airport" })
    @ApiBody({ type: CreateAirportDto })
    @Post()
    createAirport(
        @Body() airport: CreateAirportDto
    ) {
        return this.service.create(airport);
    }

    @ApiOperation({ summary: "Get all airports" })
    @Public()
    @Get()
    getAllAirports() {
        return this.service.getAll();
    }

    @ApiOperation({ summary: "Get an airport by ID" })
    @ApiParam({ name: "id", description: "The ID of the airport", example: 1 })
    @Get(":id")
    getOneAirport(
        @Param("id") id: number
    ) {
        return this.service.getOneById(id);
    }

    @ApiOperation({ summary: "Update an airport by ID" })
    @ApiParam({ name: "id", description: "The ID of the airport", example: 1 })
    @ApiBody({ type: CreateAirportDto })
    @Put(":id")
    updateAirport(
        @Param("id") id: number,
        @Body() airport: CreateAirportDto
    ) {
        return this.service.update(id, airport);
    }

    @ApiOperation({ summary: "Delete an airport by ID" })
    @ApiParam({ name: "id", description: "The ID of the airport", example: 1 })
    @Delete(":id")
    deleteAirport(
        @Param("id") id: number
    ) {
        return this.service.delete(id);
    }
}