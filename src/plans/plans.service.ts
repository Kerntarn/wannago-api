import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlanDto } from 'src/plans/plan.dto';
import { UpdatePlanDto } from 'src/plans/plan.dto';
import { Plan, planDocument } from 'src/schemas/plan.schema';

@Injectable()
export class PlansService {
  constructor(@InjectModel(Plan.name) private planModel: Model<planDocument>) {}

  create(createPlanDto: CreatePlanDto) {
    const currentUserId = "002";
    const newPlan = new this.planModel({ ...createPlanDto, ownerId: currentUserId});
    return newPlan.save();
  }

  findAll() {
    return this.planModel.find().exec();
  }

  findOne(id: string) {
    return this.planModel.findById(id).exec();
  }

  update(id: string, updatePlanDto: UpdatePlanDto) {
    return this.planModel.findByIdAndUpdate(id, updatePlanDto).exec();
  }

  remove(id: string) {
    return this.planModel.findByIdAndDelete(id).exec();
  }
}
