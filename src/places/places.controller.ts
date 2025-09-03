import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto, FindPlaceQueryDto } from 'src/places/dtos/place.dto';
import { UpdatePlaceDto } from 'src/places/dtos/place.dto';
import { CreateAccommodationDto, UpdateAccommodationDto } from 'src/places/dtos/accommodation.dto';
import { CreateRestaurantDto, UpdateRestaurantDto } from 'src/places/dtos/restaurant.dto';
import { CreateAttractionDto, UpdateAttractionDto } from 'src/places/dtos/attraction.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@Controller('places')
@ApiExtraModels(CreateAccommodationDto, CreateRestaurantDto, CreateAttractionDto)
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post('accommodation')
  createAcc(@Body() createAccommodatinDto: CreateAccommodationDto) {
    const place = this.placesService.create(createAccommodatinDto, 'Accommodation');
    return place;
  }
  @Post('attraction')
  createAtt(@Body() createAttractionDto: CreateAttractionDto) {
    const place = this.placesService.create(createAttractionDto, 'Attraction');
    return place;
  }
  @Post('restaurant')
  createRes(@Body() createRestaurantDto: CreateRestaurantDto) {
    const place = this.placesService.create(createRestaurantDto, 'Restaurant');
    return place;
  }

  @Get()
  findAll(@Query('type') t?: FindPlaceQueryDto) {
    return this.placesService.findAll(t as string);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @Patch('accommodation/:id')
  updateAcc(@Param('id') id: string, @Body() updateAccommodationDto: UpdateAccommodationDto) {
    return this.placesService.update(id, updateAccommodationDto, 'Accommodation');
  }

  @Patch('attraction/:id')
  updateAtt(@Param('id') id: string, @Body() updateAttractionDto: UpdateAttractionDto) {
    return this.placesService.update(id, updateAttractionDto, 'Attraction');
  }

  @Patch('restaurant/:id')
  updateRes(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.placesService.update(id, updateRestaurantDto, 'Restaurant');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.placesService.remove(id);
  }
}
