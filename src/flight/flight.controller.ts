import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FlightService } from "./flight.service";
import { SearchFlightDto } from "./dto/search-flight.dto";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("Flights")
@Controller("flights")
export class FlightController {
    constructor(
        private readonly service: FlightService
    ) {}

    @ApiOperation({ summary: "Search for flights based on criteria" })
    @ApiResponse({ status: 200, description: "List of matching flights" })
    @Public()
    @Get()
    searchFlights(
        @Query() search: SearchFlightDto
    ) {
        return this.service.searchFlights(search);
    }

    @ApiOperation({ summary: "Find a flight by its ID" })
    @ApiResponse({ status: 200, description: "Flight details" })
    @ApiResponse({ status: 404, description: "Flight not found" })
    @Get(":id")
    findOne(
        @Param("id") id: number
    ) {
        return this.service.findPublicById(id);
    }

    @ApiOperation({ summary: "Get the seat map of a flight" })
    @ApiResponse({ status: 200, description: "Seat map details" })
    @ApiResponse({ status: 404, description: "Flight not found" })
    @Get(":id/seat-map")
    getSeatMap(
        @Param("id") id: number
    ) {
        return this.service.getSeatMap(id);
    }
}