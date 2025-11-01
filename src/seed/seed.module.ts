import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { Place, PlaceSchema } from 'src/schemas/place.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import {
  TransportMethod,
  TransportMethodSchema,
} from 'src/schemas/transportMethod.schema';
import { Attraction, AttractionSchema } from 'src/schemas/attraction.schema';
import { Restaurant, RestaurantSchema } from 'src/schemas/restaurant.schema';
import { Accommodation, AccommodationSchema } from 'src/schemas/accommodation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Place.name, schema: PlaceSchema },
      { name: User.name, schema: UserSchema },
      { name: TransportMethod.name, schema: TransportMethodSchema },
      { name: Attraction.name, schema: AttractionSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: Accommodation.name, schema: AccommodationSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
