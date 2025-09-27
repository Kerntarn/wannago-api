import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { Plan, PlanSchema } from 'src/schemas/plan.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GuestModule } from 'src/guest/guest.module';
import { PlacesModule } from 'src/places/places.module';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
    GuestModule,
    PlacesModule,
    TagsModule,
  ],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}
