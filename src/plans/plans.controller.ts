import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from 'src/plans/plan.dto';
import { UpdatePlanDto } from 'src/plans/plan.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User, UserRole } from 'src/schemas/user.schema';
import { GuestAuthGuard } from 'src/auth/guards/guest-auth.guard';
import { CurrentGuest } from 'src/auth/decorators/current-guest.decorator';
import { GuestDocument } from 'src/schemas/guest.schema';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @Post()
  create(@Body() createPlanDto: CreatePlanDto, @CurrentUser() user: User) {
    return this.plansService.create(createPlanDto, user._id.toString());
  }

  @UseGuards(GuestAuthGuard)
  @ApiBearerAuth('guest-jwt')
  @Post('temporary')
  createTemporary(
    @Body() createPlanDto: CreatePlanDto,
    @CurrentGuest() guest: GuestDocument,
  ) {
    return this.plansService.createTemporary(createPlanDto, guest.guestId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('jwt')
  @Roles(UserRole.ADMIN)
  @Get('all')
  findAll() {
    return this.plansService.findAll();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('jwt')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user) {
      return this.plansService.findOne(id);
    }

    return await this.plansService.findOne(id, user._id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @Get()
  findByUser(@CurrentUser() currentUser: User) {
    return this.plansService.findAll(currentUser._id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @Put(':id')
  update(@Body() updatePlanDto: UpdatePlanDto, @CurrentUser() user: User) {
    console.log('pass update plan')
    return this.plansService.update(updatePlanDto, user._id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.plansService.remove(id, user._id);
  }
}
