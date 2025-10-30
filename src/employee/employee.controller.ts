import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags("Employees")
@Controller("admin/employees")
export class EmployeeController {
    constructor(
        private readonly service: EmployeeService
    ) {}

    @ApiOperation({ summary: "Create a new employee" })
    @ApiBody({ type: CreateEmployeeDto })
    @Post()
    createEmployee(
        @Body() employee: CreateEmployeeDto
    ) {
        return this.service.create(employee);
    }

    @ApiOperation({ summary: "Get all employees" })
    @Get()
    getAllEmployees() {
        return this.service.getAll();
    }

    @ApiOperation({ summary: "Get an employee by ID" })
    @ApiParam({ name: "id", description: "The ID of the employee", example: 1 })
    @Get(":id")
    getOneEmployee(
        @Param("id") id: number
    ) {
        return this.service.getOneById(id);
    }

    @ApiOperation({ summary: "Update an employee by ID" })
    @ApiParam({ name: "id", description: "The ID of the employee", example: 1 })
    @ApiBody({ type: CreateEmployeeDto })
    @Put(":id")
    updateEmployee(
        @Param("id") id: number,
        @Body() employee: CreateEmployeeDto
    ) {
        return this.service.update(id, employee);
    }

    @ApiOperation({ summary: "Delete an employee by ID" })
    @ApiParam({ name: "id", description: "The ID of the employee", example: 1 })
    @Delete(":id")
    deleteEmployee(
        @Param("id") id: number
    ) {
        return this.service.delete(id);
    }
}