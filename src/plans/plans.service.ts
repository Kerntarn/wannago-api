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
    // now dto has some field of data but we will have to do somethings to make it a complete plan then insert
    // do what??????

    // let us check first what tags user provided

    if (!createPlanDto.budget){
      // check previous plan to get average budget???
      // default set to some value like 1000??
      // or make it lowest for the cheapest plan or make it infinite for the most expensive plan???
      // or just sum all place price after got complete plan (Procrastinate)
      createPlanDto.budget = 0;
    } 
    if (!createPlanDto.startTime){
      // pick the best datetime for user
      // or will we receive as period when user can go and then we pick date from that???
      createPlanDto.startTime = new Date();
    }
    if (!createPlanDto.endTime){
      createPlanDto.endTime = new Date();
    }
    let dst = [0, 0];
    if (!createPlanDto.destination){
      // some logic to pick the best match place?
      dst = [0, 0];
    }

    const newPlan = new this.planModel({ ...createPlanDto, ownerId: currentUserId, destination: dst });
    console.log(createPlanDto);
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
