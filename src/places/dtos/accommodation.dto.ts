import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { CreatePlaceDto } from './place.dto';
// What we expect when receiving request

export class CreateAccommodationDto extends CreatePlaceDto{
    @ApiProperty()
    @IsNotEmpty()
    facilities: string[];

    @ApiProperty()
    @IsNotEmpty()
    starRating: number;
    
    @ApiProperty()
    @IsNotEmpty()
    redirectUrl: string;
}

export class UpdateAccommodationDto extends IntersectionType(
    CreatePlaceDto,
    PartialType(CreateAccommodationDto)) {}