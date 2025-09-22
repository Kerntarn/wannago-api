import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Guest, GuestSchema } from 'src/schemas/guest.schema';
import { GuestService } from './guest.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Guest.name, schema: GuestSchema }]),
  ],
  providers: [GuestService],
  exports: [GuestService],
})
export class GuestModule {}