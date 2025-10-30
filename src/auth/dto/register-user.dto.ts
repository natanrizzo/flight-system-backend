import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsDate,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The full address of the user',
    example: '123 Main St, Springfield',
  })
  @IsString()
  @IsNotEmpty()
  fullAddress: string;

  @ApiProperty({
    description: 'The phone numbers of the user',
    example: '123-456-7890',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumbers: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: 'The workplace of the user',
    example: 'Tech Corp',
  })
  @IsString()
  @IsOptional()
  workplace?: string;

  @ApiPropertyOptional({
    description: 'The work address of the user',
    example: '456 Tech Park, Springfield',
  })
  @IsString()
  @IsOptional()
  workAddress?: string;

  @ApiProperty({
    description: 'The date of birth of the user',
    example: '1990-01-01',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({
    description: 'The CPF of the user',
    example: '123.456.789-00',
  })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({
    description: 'The RG of the user',
    example: 'MG-12.345.678',
  })
  @IsString()
  @IsNotEmpty()
  rg: string;

  @ApiProperty({
    description: 'The RG issuance date',
    example: '2010-05-15',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  rgIssuanceDate: Date;

  @ApiProperty({
    description: 'The RG issuing agency',
    example: 'SSP',
  })
  @IsString()
  @IsNotEmpty()
  rgIssuingAgency: string;

  @ApiProperty({
    description: 'The username for authentication',
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The password for authentication',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
