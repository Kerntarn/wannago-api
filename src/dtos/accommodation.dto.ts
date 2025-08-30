import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreatePlaceDto } from './place.dto';
// What we expect when receiving request

export class CreateAccommodationDto {
    @ApiProperty()
    facilities: string[];

    @ApiProperty()
    starRating: number;

    @ApiProperty()
    redirectUrl: string;
}