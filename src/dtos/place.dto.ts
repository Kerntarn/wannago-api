import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateAccommodationDto } from './accommodation.dto';
import { CreateAttractionDto } from './attraction.dto';
import { CreateRestaurantDto } from './restaurant.dto';
// What we expect when receiving request
export enum PlaceType {
    HOTEL = 'hotel',
    RESTAURANT = 'restaurant',
    ATTRACTION = 'attraction',
}

export class CreatePlaceDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    imgaeUrl: string;

    @ApiProperty()
    location: number[];

    @ApiProperty()
    description: string;

    @ApiProperty()
    @IsEnum(PlaceType)
    type: PlaceType;

    @ApiProperty({oneOf: [
      { $ref: getSchemaPath(CreateAccommodationDto) },
      { $ref: getSchemaPath(CreateRestaurantDto) },
      { $ref: getSchemaPath(CreateAttractionDto) },
    ],})
    data: CreateAccommodationDto | CreateAttractionDto | CreateRestaurantDto;
}

export class UpdatePlaceDto {
    @ApiProperty()
    imgaeUrl: string;

    @ApiProperty()
    description: string;

}