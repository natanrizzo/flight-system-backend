import { PartialType } from '@nestjs/swagger';
import { CreateAircraftTypeDto } from './create-aircraft-type.dto';


export class UpdateAircraftTypeDto extends PartialType(CreateAircraftTypeDto) {}