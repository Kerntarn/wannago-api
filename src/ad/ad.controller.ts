import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { AdService } from './ad.service';
import { CreateAdDto } from './dtos/create-ad.dto';
import { RenewAdDto } from './dtos/renew-ad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('jwt') 
@Controller('ad')
export class AdController {
  constructor(private readonly adService: AdService) {}

  //สร้าง add
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post()
  async create(@CurrentUser() user: any,@Body() createAdDto: CreateAdDto) {

    console.log('=== DEBUG ===');
    console.log('DTO Type:', createAdDto.constructor.name);
    console.log('Transaction Type:', createAdDto.transaction?.constructor.name);
    console.log('CardInfo Type:', createAdDto.transaction?.cardInfo?.constructor.name);
    console.log('Holder Type:', typeof createAdDto.transaction?.cardInfo?.holder);
    console.log('Holder Value:', createAdDto.transaction?.cardInfo?.holder);
    console.log('=============');

    const userId = user._id;
    const ad = await this.adService.createAd(userId, createAdDto);
    return {data: ad};
  }

  //ดู dash board มีสถิติ กราฟ ตารางสถานะ
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get()
  async get(@CurrentUser() user: any) {
    const userId = user._id;
    const data = await this.adService.getAllAds(userId);
    return { data };
  }

  //ลบ ad by id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Delete(':adId')
  async deleteAd(@CurrentUser() user: any, @Param('adId') adId: string) {
    const ownerId = user._id;
    return this.adService.deleteAd(adId, ownerId);
  }

  //ad stat
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Get(':adId')
  async getAdById(@CurrentUser() user: any, @Param('adId') adId: string) {
    const ownerId = user._id;
    const adStats = await this.adService.getAdById(ownerId, adId);
    if (!adStats) {
      throw new NotFoundException('Ad stats not found');
    }
    return adStats;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Patch('/renew/:adId')
  async renew(@CurrentUser() user: any, @Param('adId') adId: string, @Body() renewAdDto: RenewAdDto) {
    const ownerId = user._id;
    const ad = await this.adService.renewAd(adId, ownerId, renewAdDto);
    return {data: ad};

  }

  @Patch(':id/view')
  async addView(@Param('id') id: string) {
    const ad = await this.adService.incrementViews(id);
    return { data: ad };
  }

  @Patch(':id/click')
  async addClick(@Param('id') id: string) {
    const ad = await this.adService.incrementClicks(id);
    return { data: ad };
  }

  @Patch(':id/contacts')
  async addContacts(@Param('id') id: string) {
    const ad = await this.adService.incrementContacts(id);
    return { data: ad };
  }

  @Patch(':id/bookings')
  async addBookings(@Param('id') id: string) {
    const ad = await this.adService.incrementBookings(id);
    return { data: ad };
  }
  
}
