import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdService } from './ad.service';
import { CreateAdDto } from './dtos/create-ad.dto';
import { UpdateAdDto } from './dtos/update-ad.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('ad')
export class AdController {
  constructor(private readonly adService: AdService) {}


  //สร้าง add
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post()
  async create(@CurrentUser() user: any,@Body() createAdDto: CreateAdDto) {
    const userId = user._id;
    const ad = await this.adService.createAd(userId, createAdDto);
    return {data: ad};
  }

  //เอาทุก ads ของ user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get()
  async getAllAds(@CurrentUser() user: any) {
    const userId = user._id;
    const ads = await this.adService.getAllAdsByUser(userId);
    return { data: ads };
  }

  //ลบ ad by id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Delete(':adId')
  async deleteAd(@CurrentUser() user: any, @Param('adId') adId: string) {
    const ownerId = user._id;
    return this.adService.deleteAd(adId, ownerId);
  }
  
}
