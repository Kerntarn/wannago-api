import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from 'src/plans/plan.dto';
import { UpdatePlanDto } from 'src/plans/plan.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/schemas/user.schema';
import { GuestAuthGuard } from 'src/auth/guards/guest-auth.guard';
import { CurrentGuest } from 'src/auth/decorators/current-guest.decorator';
import { GuestDocument } from 'src/schemas/guest.schema';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPlanDto: CreatePlanDto, @CurrentUser() user: User) {
    return this.plansService.create(createPlanDto, user._id.toString());
  }

  @UseGuards(GuestAuthGuard)
  @ApiBearerAuth('guest-jwt')
  @Post('temporary')
  createTemporary(@Body() createPlanDto: CreatePlanDto, @CurrentGuest() guest: GuestDocument) {
    return this.plansService.createTemporary(createPlanDto, guest.guestId);
  }

  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }
}
