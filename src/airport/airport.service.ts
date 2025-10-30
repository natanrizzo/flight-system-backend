import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAirportDto } from "./dto/create-airport.dto";
import { UpdateAirportDto } from "./dto/update-airport.dto";

@Injectable()
export class AirportService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    create(airport: CreateAirportDto) {
        return this.prisma.airport.create({
            data: airport
        })
    }

    getAll() {
        return this.prisma.airport.findMany();
    }

    getOneById(id: number) {
        return this.prisma.airport.findUnique({
            where: { id }
        })
    }

    update(id: number, airport: UpdateAirportDto) {
        return this.prisma.airport.update({
            where: { id },
            data: airport
        })
    }

    delete(id: number) {
        return this.prisma.airport.delete({
            where: { id }
        })
    }
}