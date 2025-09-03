import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { CreatePlaceDto, UpdatePlaceDto } from './place.dto';
// What we expect when receiving request

export class CreateAttractionDto extends CreatePlaceDto{
    @ApiProperty()
    @IsNotEmpty()
    entryFee: number;
}

export class UpdateAttractionDto extends IntersectionType(
    UpdatePlaceDto,
    PartialType(CreateAttractionDto)) {}