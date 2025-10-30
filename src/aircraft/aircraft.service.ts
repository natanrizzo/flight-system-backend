import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAircraftTypeDto } from "./dto/create-aircraft-type.dto";
import { UpdateAircraftTypeDto } from "./dto/update-aircraft-type.dto";
import { CreateAircraftDto } from "./dto/create-aircraft.dto";
import { UpdateAircraftDto } from "./dto/update-aircraft.dto";

@Injectable()
export class AircraftService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    createAircraftType(aircraftType: CreateAircraftTypeDto) {
        return this.prisma.aircraftType.create({
            data: aircraftType
        })
    }

    getAllAircraftTypes() {
        return this.prisma.aircraftType.findMany();
    }

    getOneAircraftTypeById(id: number) {
        return this.prisma.aircraftType.findUnique({
            where: { id }
        })
    }

    updateAircraftType(id: number, aircraftType: UpdateAircraftTypeDto) {
        return this.prisma.aircraftType.update({
            where: { id },
            data: aircraftType
        })
    }

    deleteAircraftType(id: number) {
        return this.prisma.aircraftType.delete({
            where: { id }
        })
    }

    createAircraft(aircraft: CreateAircraftDto) {
        return this.prisma.aircraft.create({
            data: aircraft
        });
    }

    getAllAircraft() {
        return this.prisma.aircraft.findMany();
    }

    getOneAircraftById(id: number) {
        return this.prisma.aircraft.findUnique({
            where: { id }
        });
    }

    updateAircraft(id: number, aircraft: UpdateAircraftDto) {
        return this.prisma.aircraft.update({
            where: { id },
            data: aircraft
        });
    }

    deleteAircraft(id: number) {
        return this.prisma.aircraft.delete({
            where: { id }
        })
    }
}