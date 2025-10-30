import { PartialType } from '@nestjs/swagger';
import { CreateFlightTypeDto } from './create-flight-type.dto';

export class UpdateFlightTypeDto extends PartialType(CreateFlightTypeDto) {}