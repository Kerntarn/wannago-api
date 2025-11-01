import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from 'src/auth/dtos/register.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {}