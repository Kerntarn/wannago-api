import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUrl, Max, Min } from 'class-validator';
import { CreatePlaceDto } from './place.dto';
// What we expect when receiving request

export class CreateAccommodationDto extends CreatePlaceDto{
    @ApiProperty()
    @IsNotEmpty()
    facilities: string[];

    @ApiProperty()
    @IsNotEmpty()
    @Min(0)
    @Max(5)
    starRating: number;
    
    @ApiProperty()
    @IsOptional()
    @IsUrl()
    redirectUrl?: string;
}

export class UpdateAccommodationDto extends IntersectionType(
    CreatePlaceDto,
    PartialType(CreateAccommodationDto)) {}