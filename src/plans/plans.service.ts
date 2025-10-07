import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlanDto } from 'src/plans/plan.dto';
import { UpdatePlanDto } from 'src/plans/plan.dto';
import { Plan, planDocument } from 'src/schemas/plan.schema';
import { GuestService } from 'src/guest/guest.service';
import { PlacesService } from 'src/places/places.service';
import { TagsService } from 'src/tags/tags.service';
import { Place } from 'src/schemas/place.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan.name) private planModel: Model<planDocument>,
    private readonly guestService: GuestService,
    private readonly placesService: PlacesService,
    private readonly tagsService: TagsService,
  ) {}

  async create(createPlanDto: CreatePlanDto, userId: string) {
    const newPlan = await this._toEntity(createPlanDto);
    //calculate to find destination place and plan for user who only fill a little info
    //show plan for select
    //Add route
    const createdPlan = new this.planModel(newPlan);
    createdPlan.save();
    return createdPlan;
  }

  async createTemporary(createPlanDto: CreatePlanDto, guestId: string) {
    const newPlan = await this._toEntity(createPlanDto);
    const createdPlan = new this.planModel(newPlan);
    this.guestService.addPlanToGuest(guestId, createdPlan._id);
    await createdPlan.save();
    return this._toResponse(createdPlan);
  }

  async assignPlanToUser(planId: string, userId: string): Promise<Plan> {
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


  async _toEntity(dto: CreatePlanDto) {
    const allTags = await this.tagsService.findAll();
    if (!dto.preferredTags.every(tag => allTags.includes(tag))) {
      throw new BadRequestException('Some tags are not recognized');
    }

    let places = await this.placesService.findByName(dto.destination);
    if (places.length == 0) {
      places = await this.placesService.findAll();
    }

    const dst = await this.placesService.getMostRelatedPlace(places, dto.preferredTags);
    if (!dst) {
      throw new BadRequestException('Unable to identify destination place');
    }
    // // now dto has some field of data but we will have to do somethings to make it a complete plan then insert
    // // do what??????

    // // let us check first what tags user provided

    // if (!createPlanDto.budget){
    //   // check previous plan to get average budget???
    //   // default set to some value like 1000??
    //   // or make it lowest for the cheapest plan or make it infinite for the most expensive plan???
    //   // or just sum all place price after got complete plan (Procrastinate)
    //   createPlanDto.budget = 0;
    // } 
    // if (!createPlanDto.startTime){
    //   // pick the best datetime for user
    //   // or will we receive as period when user can go and then we pick date from that???
    //   createPlanDto.startTime = new Date();
    // }
    // if (!createPlanDto.endTime){
    //   createPlanDto.endTime = new Date();
    // }
    // let dst = [0, 0];
    // if (!createPlanDto.destination){
    //   // some logic to pick the best match place?
    //   dst = [0, 0];
    // }

    // calculate to find destination place and plan for user who only fill a little info
    return {
      source: dto.source,
      startTime: dto.startTime,
      endTime: dto.endTime,
      preferredTags: dto.preferredTags,
      budget: dto.budget,
      groupSize: dto.groupSize,
      ownerId: null,
    };
  }

  async _toResponse(plan: Plan): Promise<any> {
    
    return plan;
  }


}
