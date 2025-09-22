import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlanDto } from 'src/plans/plan.dto';
import { UpdatePlanDto } from 'src/plans/plan.dto';
import { Plan, planDocument } from 'src/schemas/plan.schema';
import { GuestService } from 'src/guest/guest.service';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan.name) private planModel: Model<planDocument>,
    private guestService: GuestService,
  ) {}

  create(createPlanDto: CreatePlanDto, userId: string) {
    const newPlan = new this.planModel({ ...createPlanDto, ownerId: userId});
    return newPlan.save();
  }

  async createTemporary(createPlanDto: CreatePlanDto, guestId: string) {
    const newPlan = new this.planModel({ ...createPlanDto, guestId });
    const savedPlan = await newPlan.save();
    await this.guestService.addPlanToGuest(guestId, savedPlan._id);
    return savedPlan;
  }

  async assignPlanToUser(planId: string, userId: string) {
    return this.planModel.findByIdAndUpdate(planId, { ownerId: userId }).exec();
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
