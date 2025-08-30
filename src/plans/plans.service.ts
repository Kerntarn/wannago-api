import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from 'src/dtos/plan.dto';
import { UpdatePlanDto } from 'src/dtos/plan.dto';

@Injectable()
export class PlansService {
  create(createPlanDto: CreatePlanDto) {
    return 'This action adds a new plan';
  }

  findAll() {
    return `This action returns all plans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} plan`;
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
