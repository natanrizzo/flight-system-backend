import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

@Injectable()
export class EmployeeService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    create(employee: CreateEmployeeDto) {
        return this.prisma.employee.create({
            data: employee
        })
    }

    getAll() {
        return this.prisma.employee.findMany();
    }

    getOneById(id: number) {
        return this.prisma.employee.findUnique({
            where: { id }
        })
    }

    update(id: number, employee: UpdateEmployeeDto) {
        return this.prisma.employee.update({
            where: { id },
            data: employee
        })
    }

    delete(id: number) {
        return this.prisma.employee.delete({
            where: { id }
        })
    }
}