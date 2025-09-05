import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlacesModule } from './places/places.module';
import { TransactionModule } from './transaction/transaction.module';
// import { TransportModule } from './transport/transportMethod.module';

@Module({
  imports: [ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.MONGO_URL}`),
    PlacesModule,
    TransactionModule,],
    // TransportModule,],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule {}
