import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { Place, PlaceSchema } from 'src/schemas/place.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { TransportMethod, TransportMethodSchema } from 'src/schemas/transportMethod.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Place.name, schema: PlaceSchema }, 
      { name: User.name, schema: UserSchema },
      { name: TransportMethod.name, schema: TransportMethodSchema },]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
