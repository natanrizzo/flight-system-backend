import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AircraftService } from "./aircraft.service";
import { CreateAircraftTypeDto } from "./dto/create-aircraft-type.dto";
import { UpdateAircraftTypeDto } from "./dto/update-aircraft-type.dto";
import { CreateAircraftDto } from "./dto/create-aircraft.dto";
import { UpdateAircraftDto } from "./dto/update-aircraft.dto";
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags("Aircraft")
@Controller("admin/aircraft")
export class AircraftController {
    constructor(
        private readonly service: AircraftService
    ) {}

    @ApiOperation({ summary: "Create a new aircraft type" })
    @ApiBody({ type: CreateAircraftTypeDto })
    @Post("types")
    createAircraftType(@Body() dto: CreateAircraftTypeDto) {
        return this.service.createAircraftType(dto);
    }

    @ApiOperation({ summary: "Get all aircraft types" })
    @Get("types")
    getAllAircraftTypes() {
        return this.service.getAllAircraftTypes();
    }

    @ApiOperation({ summary: "Get an aircraft type by ID" })
    @ApiParam({ name: "id", description: "The ID of the aircraft type", example: 1 })
    @Get("types/:id")
    getOneAircraftTypeById(@Param("id") id: number) {
        return this.service.getOneAircraftTypeById(id);
    }

    @ApiOperation({ summary: "Update an aircraft type by ID" })
    @ApiParam({ name: "id", description: "The ID of the aircraft type", example: 1 })
    @ApiBody({ type: UpdateAircraftTypeDto })
    @Put("types/:id")
    updateAircraftType(@Param("id") id: number, @Body() dto: UpdateAircraftTypeDto) {
        return this.service.updateAircraftType(id, dto);
    }

    @ApiOperation({ summary: "Delete an aircraft type by ID" })
    @ApiParam({ name: "id", description: "The ID of the aircraft type", example: 1 })
    @Delete("types/:id")
    deleteAircraftType(@Param("id") id: number) {
        return this.service.deleteAircraftType(id);
    }

    @ApiOperation({ summary: "Create a new aircraft" })
    @ApiBody({ type: CreateAircraftDto })
    @Post()
    createAircraft(@Body() dto: CreateAircraftDto) {
        return this.service.createAircraft(dto);
    }

    @ApiOperation({ summary: "Get all aircraft" })
    @Get()
    getAllAircraft() {
        return this.service.getAllAircraft();
    }

    @ApiOperation({ summary: "Get an aircraft by ID" })
    @ApiParam({ name: "id", description: "The ID of the aircraft", example: 1 })
    @Get(":id")
    getOneAircraftById(@Param("id") id: number) {
        return this.service.getOneAircraftById(id);
    }

    @ApiOperation({ summary: "Update an aircraft by ID" })
    @ApiParam({ name: "id", description: "The ID of the aircraft", example: 1 })
    @ApiBody({ type: UpdateAircraftDto })
    @Put(":id")
    updateAircraft(@Param("id") id: number, @Body() dto: UpdateAircraftDto) {
        return this.service.updateAircraft(id, dto);
    }

    @ApiOperation({ summary: "Delete an aircraft by ID" })
    @ApiParam({ name: "id", description: "The ID of the aircraft", example: 1 })
    @Delete(":id")
    deleteAircraft(@Param("id") id: number) {
        return this.service.deleteAircraft(id);
    }
}