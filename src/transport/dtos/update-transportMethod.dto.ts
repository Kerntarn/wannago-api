import { PartialType } from '@nestjs/swagger';
import { CreateTransportMethodDto } from './create-transportMethod.dto';

export class UpdateTransportMethodDto extends PartialType(CreateTransportMethodDto) {}


