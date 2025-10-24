import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransportMethodService } from './transportMethod.service';
import { TransportMethodController } from './transportMethod.controller';
import { TransportMethod, TransportMethodSchema } from '../schemas/transportMethod.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: TransportMethod.name, schema: TransportMethodSchema }])],
  controllers: [TransportMethodController],
  providers: [TransportMethodService],
  exports: [TransportMethodService], // Export TransportMethodService
})
export class TransportModule {}
