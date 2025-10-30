import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAirportDto {
  @ApiProperty({
    description: 'The 3-letter airport code',
    example: 'JFK',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3, { message: 'Airport code must be exactly 3 characters' })
  code: string;

  @ApiProperty({
    description: 'The name of the airport',
    example: 'John F. Kennedy International Airport',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The city where the airport is located',
    example: 'New York',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'The state where the airport is located',
    example: 'New York',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'The country where the airport is located',
    example: 'United States',
  })
  @IsString()
  @IsNotEmpty()
  country: string;
}