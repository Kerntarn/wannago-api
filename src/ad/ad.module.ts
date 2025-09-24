import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { Ad, AdSchema } from '../schemas/ad.schema';
import { Place, PlaceSchema } from 'src/schemas/place.schema';
import { TransactionModule } from 'src/transaction/transaction.module';
import { PlacesModule } from 'src/places/places.module';

@Module({

  imports: [
    MongooseModule.forFeature([{ name: Ad.name, schema: AdSchema }]),
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
    TransactionModule, 
    PlacesModule
  ],

  controllers: [AdController],
  providers: [AdService],
  exports: [AdService],
})
export class AdModule {}
