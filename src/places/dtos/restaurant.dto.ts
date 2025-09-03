import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { CreatePlaceDto, UpdatePlaceDto } from './place.dto';
// What we expect when receiving request

export class CreateRestaurantDto extends CreatePlaceDto {
    @ApiProperty()
    @IsNotEmpty()
    openingHours: string;
    
    @ApiProperty()
    @IsNotEmpty()
    closingHours: string;
    
    @ApiProperty()
    @IsNotEmpty()
    cuisineType: string;
    
    @ApiProperty()
    @IsNotEmpty()
    contactInfo: string;
}

export class UpdateRestaurantDto extends IntersectionType(
    UpdatePlaceDto, 
    PartialType(CreateRestaurantDto)) {}