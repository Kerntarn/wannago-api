import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from 'src/schemas/place.schema';
import { Accommodation, AccommodationSchema } from 'src/schemas/accommodation.schema';
import { Attraction, AttractionSchema } from 'src/schemas/attraction.schema';
import { Restaurant, RestaurantSchema } from 'src/schemas/restaurant.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Place.name, schema: PlaceSchema },
    { name: Accommodation.name, schema: AccommodationSchema },
    { name: Attraction.name, schema: AttractionSchema },
    { name: Restaurant.name, schema: RestaurantSchema },
    ]),],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
