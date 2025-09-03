import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlacesModule } from './places/places.module';
import { PlansModule } from './plans/plans.module';

@Module({
  imports: [ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.MONGO_URL}`),
    PlacesModule,
    PlansModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
