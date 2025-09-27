import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from 'src/schemas/place.schema';
import { Accommodation, AccommodationSchema } from 'src/schemas/accommodation.schema';
import { Attraction, AttractionSchema } from 'src/schemas/attraction.schema';
import { Restaurant, RestaurantSchema } from 'src/schemas/restaurant.schema';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [MongooseModule.forFeatureAsync([
    {
    name: Place.name, 
    useFactory: () => {
      const schema = PlaceSchema;
      schema.discriminator(Accommodation.name, AccommodationSchema);
      schema.discriminator(Attraction.name, AttractionSchema);
      schema.discriminator(Restaurant.name, RestaurantSchema);
      return schema;
    }
  }]),
    TagsModule],
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [MongooseModule, PlacesService],
})
export class PlacesModule {}
