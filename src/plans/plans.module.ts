import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { Plan, PlanSchema } from 'src/schemas/plan.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }])],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
