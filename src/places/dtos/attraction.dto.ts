import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { CreatePlaceDto, UpdatePlaceDto } from './place.dto';
// What we expect when receiving request

export class CreateAttractionDto extends CreatePlaceDto{
    @ApiProperty({ example: 50 })
    @IsNotEmpty()
    @Min(0)
    entryFee: number;
}

export class UpdateAttractionDto extends IntersectionType(
    UpdatePlaceDto,
    PartialType(CreateAttractionDto)) {}