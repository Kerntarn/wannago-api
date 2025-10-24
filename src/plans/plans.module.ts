import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { Plan, PlanSchema } from 'src/schemas/plan.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GuestModule } from 'src/guest/guest.module';
import { PlacesModule } from 'src/places/places.module';
import { TagsModule } from 'src/tags/tags.module';
import { TransportModule } from 'src/transport/transportMethod.module'; // Import TransportModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
    GuestModule,
    PlacesModule,
    TagsModule,
    TransportModule, // Add TransportModule to imports
  ],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}
