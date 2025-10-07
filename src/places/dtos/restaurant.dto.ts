import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { CreatePlaceDto, UpdatePlaceDto } from './place.dto';
// What we expect when receiving request

export class CreateRestaurantDto extends CreatePlaceDto {
    @ApiProperty({format: 'date-time', example: '1970-01-01T10:00:00+07:00', description: 'Need only time not date',})
    @IsNotEmpty()
    @IsDateString()
    openingHours: string;
    
    @ApiProperty({format: 'date-time', example: '1970-01-01T20:00:00+07:00', description: 'Need only time not date'})
    @IsNotEmpty()
    @IsDateString()
    closingHours: string;
    
    @ApiProperty({ example: "Thai Street Food" })
    @IsNotEmpty()
    cuisineType: string;

    @ApiProperty({ example: "081-234-5678" })
    @IsNotEmpty()
    contactInfo: string;
}

export class UpdateRestaurantDto extends IntersectionType(
    UpdatePlaceDto, 
    PartialType(CreateRestaurantDto)) {}