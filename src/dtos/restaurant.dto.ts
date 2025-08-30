import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreatePlaceDto } from './place.dto';
// What we expect when receiving request

export class CreateRestaurantDto {
    @ApiProperty()
    openingHours: string;

    @ApiProperty()
    closingHours: string;
     
    @ApiProperty()
    cuisineType: string;
     
    @ApiProperty()
    contactInfo: string;
}