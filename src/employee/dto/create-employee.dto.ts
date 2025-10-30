import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeRole } from '@prisma/client';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'The full name of the employee',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Date of birth for the employee',
    example: '2002-10-11',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({
    description: 'The phone number for the employee',
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  mobilePhone: string;

  @ApiProperty({
    description: 'The username for the employee',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The role of the employee',
    example: 'MANAGER',
  })
  @IsEnum(EmployeeRole)
  @IsNotEmpty()
  role: EmployeeRole;
}
