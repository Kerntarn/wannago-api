import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ad, AdDocument } from '../schemas/ad.schema';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';
import { Place, PlaceDocument } from '../schemas/place.schema';
import { CreateAdDto } from './dtos/create-ad.dto';
import { UsersService } from 'src/users/users.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionStatus } from 'src/transaction/transaction.asset';
import { AdStatus } from './ad.asset';
import { RenewAdDto } from './dtos/renew-ad.dto';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class AdService {

  constructor(
    private readonly userService: UsersService,
    private readonly transactionService: TransactionService,
    @InjectModel(Ad.name) private adModel: Model<AdDocument>,
    @InjectModel(Place.name) private placeModel: Model<PlaceDocument>,
  ) {}

  //สร้าง
  async createAd(providerId: string, createAdDto: CreateAdDto) { //แก้

    const provider = await this.userService.findById(providerId);
    if (!provider) {
      throw new NotFoundException('User not found');
    }

    const place = await this.placeModel.findById(createAdDto.placeId);
    if (!place) {
      throw new NotFoundException('Place not found');
    }

    const existingAd = await this.adModel.findOne({providerId: provider._id,placeId: place._id,});
    if (existingAd) {
      throw new BadRequestException('This provider already has an ad for this place');
    }

    const ad = await this.adModel.create({
      providerId: provider._id,
      placeId: place._id,
      durationDays: createAdDto.durationDays,
      price: createAdDto.price,
    });

    const transaction = await this.transactionService.create(providerId, ad.id, createAdDto.transaction);
    if (transaction.status == TransactionStatus.SUCCESS){
      ad.status = AdStatus.ACTIVE;
      ad.expireAt = new Date(Date.now() + ad.durationDays * 24*60*60*1000);

      await ad.save();
    }
    return {
      id: ad._id,
      providerId: ad.providerId,
      placeId: ad.placeId,
      status: ad.status,
      durationDays: ad.durationDays,
      price: ad.price,
      expireAt: ad.expireAt
    };
  }


  async renewAd(adId: string, providerId: string, renewAdDto: RenewAdDto) {

    if (!Types.ObjectId.isValid(adId)) {
      throw new BadRequestException('Invalid ad ID format');
    }

    const provider = await this.userService.findById(providerId);
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const ad = await this.adModel.findById(adId);
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    if (!ad.providerId.equals(new Types.ObjectId(providerId))) {
      throw new ForbiddenException('You do not have permission to renew this ad');
    }

    if (ad.status == AdStatus.ACTIVE){
      throw new BadRequestException('Cannot renew an active ad. Please wait until it expires.');
    }

    if (ad.status == AdStatus.EXPIRED){
      const transaction = await this.transactionService.create(providerId, ad.id, renewAdDto.transaction);
      
      if (transaction.status == TransactionStatus.SUCCESS){
        ad.status = AdStatus.ACTIVE;
        ad.expireAt = new Date(Date.now() + ad.durationDays * 24*60*60*1000);
        await ad.save();

        return {
          id: ad._id,
          providerId: ad.providerId,
          placeId: ad.placeId,
          status: ad.status,
          durationDays: ad.durationDays,
          price: ad.price,
          expireAt: ad.expireAt
        };
      }
    }

    if (ad.status == AdStatus.EXPIRED){
      throw new BadRequestException('Cannot renew pending ad');
    }
  }

  async getAllAds(providerId: string){

    const stats = await this.getAllAdsStats(providerId)
    const graph = await this.getAllAdsGraph(providerId)
    const table = await this.getTable(providerId)
    return { stats , graph, table }

  }

  async getAdById(providerId: string, adId: string){

    const adObjectId = new Types.ObjectId(adId);
    const userObjectId = new Types.ObjectId(providerId);

    if (!Types.ObjectId.isValid(adId)) {
      throw new BadRequestException('Invalid Ad ID');
    }

    const ad = await this.adModel.findById(adObjectId);
    if (!ad) throw new NotFoundException('Ad not found');

    if (!ad.providerId.equals(userObjectId)) {
      throw new ForbiddenException('You are not allowed to access this ad');
    } 

    const stats = await this.getAdStats(adId)
    const graph = await this.getAdGraph(adId)

    return { stats , graph}

  }

  async getAllAdsStats(providerId: string) {
   
    const providerObjectId = new Types.ObjectId(providerId);
    const ads = await this.adModel.find({ providerId: providerObjectId }).sort({ createdAt: -1 });

    if (!ads || ads.length === 0) {
      return {
        total: {
          views: 0,
          clicks: 0,
          contacts: 0,
          bookings: 0,
          ctr: 0,
        }
      };
    }

    const totalViews = ads.reduce((sum, ad) => sum + ad.views, 0);
    const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
    const totalContacts = ads.reduce((sum, ad) => sum + ad.contacts, 0);
    const totalBookings = ads.reduce((sum, ad) => sum + ad.bookings, 0);
    const ctr = totalViews > 0 ? parseFloat(((totalClicks / totalViews) * 100).toFixed(2)) : 0;

    return {
      total: {
        views: totalViews,
        clicks: totalClicks,
        contacts: totalContacts,
        bookings: totalBookings,
        ctr: ctr,
      }
    };
  }

  async getAllAdsGraph(ownerId: string) {
    const ads = await this.adModel
      .find({ providerId: new Types.ObjectId(ownerId) })
      .sort({ createdAt: 1 });

    const stats: Record<string, any> = {};
    const endDate = new Date();

    let firstDate: Date;

    if (!ads.length) {
      // ไม่มีโฆษณา
      firstDate = new Date();
      firstDate.setDate(endDate.getDate() - 29);
    } else {
      firstDate = new Date(Math.min(...ads.map(a => a.createdAt.getTime())));
    }

    let current = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
    while (current <= endDate) {
      const dayKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      stats[dayKey] = { date: dayKey, click: 0, view: 0, contract: 0, booking: 0, ctr: 0 };
      current.setDate(current.getDate() + 1);
    }

    ads.forEach(ad => {
      const dayKey = `${ad.createdAt.getFullYear()}-${String(ad.createdAt.getMonth() + 1).padStart(2, '0')}-${String(ad.createdAt.getDate()).padStart(2, '0')}`;
      if (!stats[dayKey]) return;
      stats[dayKey].click += ad.clicks;
      stats[dayKey].view += ad.views;
      stats[dayKey].contract += ad.contacts;
      stats[dayKey].booking += ad.bookings;
    });

    Object.values(stats).forEach(stat => {
      stat.ctr = stat.view > 0 ? parseFloat(((stat.click / stat.view) * 100).toFixed(2)) : 0;
    });

    return Object.values(stats).sort((a, b) => a.date > b.date ? 1 : -1);
  }


  async getAdStats(adId: string) {

    const adObjectId = new Types.ObjectId(adId);

    const ad = await this.adModel.findById(adObjectId).populate<{ placeId: PlaceDocument }>('placeId', 'name');
    if (!ad) throw new NotFoundException('Ad not found');

    const ctr = ad.views > 0 ? parseFloat(((ad.clicks / ad.views) * 100).toFixed(2)) : 0;

    return {
      adId: ad._id,
      placeName: ad.placeId.name,
      stats: {
        views: ad.views,
        clicks: ad.clicks,
        contacts: ad.contacts,
        bookings: ad.bookings,
        ctr,
      },
    };
  }

  async getAdGraph(adId: string) {
    const adObjectId = new Types.ObjectId(adId);
    const ad = await this.adModel.findById(adObjectId);
    if (!ad) throw new NotFoundException('Ad not found');

    const firstDate = new Date(ad.createdAt);
    const endDate = new Date();

    const stats: Record<string, any> = {};

    // สร้าง key ของทุกวันตั้งแต่ createdAt ถึงวันนี้
    let current = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
    while (current <= endDate) {
      const dayKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      stats[dayKey] = { date: dayKey, click: 0, view: 0, contract: 0, booking: 0, ctr: 0 };
      current.setDate(current.getDate() + 1);
    }

    // ✅ ใช้ dailyStats แทน total stats
    if (Array.isArray(ad.dailyStats)) {
      ad.dailyStats.forEach(ds => {
        const dayKey = `${ds.date.getFullYear()}-${String(ds.date.getMonth() + 1).padStart(2,'0')}-${String(ds.date.getDate()).padStart(2,'0')}`;
        if (!stats[dayKey]) {
          stats[dayKey] = { date: dayKey, click: 0, view: 0, contract: 0, booking: 0, ctr: 0 };
        }
        stats[dayKey].click += ds.clicks ?? 0;
        stats[dayKey].view += ds.views ?? 0;
        stats[dayKey].contract += ds.contacts ?? 0;
        stats[dayKey].booking += ds.bookings ?? 0;
      });
    }

    Object.values(stats).forEach(stat => {
      stat.ctr = stat.view > 0 ? parseFloat(((stat.click / stat.view) * 100).toFixed(2)) : 0;
    });

    return Object.values(stats).sort((a, b) => a.date.localeCompare(b.date));
  }

  async incrementBookings(placeId: string) {
    const ad = await this.adModel.findOne({ placeId });
    if (!ad) return false;

    const today = new Date();
    const dayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

    let todayStat = ad.dailyStats?.find(ds => {
      const dsKey = `${ds.date.getFullYear()}-${ds.date.getMonth()}-${ds.date.getDate()}`;
      return dsKey === dayKey;
    });

    if (!todayStat) {
      todayStat = { date: today, views: 0, clicks: 0, contacts: 0, bookings: 0, ctr: 0 };
      if (!ad.dailyStats) ad.dailyStats = [];
      ad.dailyStats.push(todayStat);
    }

    ad.bookings += 1;
    todayStat.bookings += 1;

    ad.markModified('dailyStats');
    await ad.save();
    return true;
  }
  
  async getTable(providerId: string) {
   
    if (!Types.ObjectId.isValid(providerId)) {
      throw new NotFoundException('Invalid providerId');
    }

    const ads = await this.adModel
      .find({ providerId: new Types.ObjectId(providerId) })
      .sort({ createdAt: -1 })
      .populate<{ placeId: PlaceDocument }>('placeId', 'name'); 

    if (!ads.length) {
      return [];
    }

    return ads.map(ad => ({
      id: ad._id,
      providerId: ad.providerId,
      placeId: ad.placeId._id,
      placeName: ad.placeId.name, 
      status: ad.status,
      createdAt: ad.createdAt,
      expireAt: ad.expireAt,
      price: ad.price,
    }));
  }

  async deleteAd(adId: string, providerId: string) {

    if (!Types.ObjectId.isValid(adId)) {
      throw new BadRequestException('Invalid ad ID format');
    }

    const ad = await this.adModel.findById(adId);
    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    if (!ad.providerId.equals(new Types.ObjectId(providerId))) {
      throw new ForbiddenException('You do not have permission to delete this ad');
    }

    await this.adModel.deleteOne({ _id: adId });
    return { message: 'Ad deleted successfully' };
  }



  async incrementViews(placeId: string) {
    const ad = await this.adModel.findOne({ placeId });
    if (!ad) {
      console.log('Ad not found for placeId:', placeId);
      return false;
    }

    const today = new Date();
    const dayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

    // หา dailyStat ของวันนี้
    let todayStat = ad.dailyStats?.find(ds => {
      const dsKey = `${ds.date.getFullYear()}-${ds.date.getMonth()}-${ds.date.getDate()}`;
      return dsKey === dayKey;
    });

    if (!todayStat) {
      todayStat = { date: today, views: 0, clicks: 0, contacts: 0, bookings: 0, ctr: 0 };
      if (!ad.dailyStats) ad.dailyStats = [];
      ad.dailyStats.push(todayStat);
    }

    // เพิ่ม view ทั้งหมดและ view ของวันนี้
    ad.views += 1;
    todayStat.views += 1;

    // คำนวณ ctr ใหม่ทั้ง ad และ daily
    ad.ctr = ad.views > 0 ? parseFloat(((ad.clicks / ad.views) * 100).toFixed(2)) : 0;
    todayStat.ctr = todayStat.views > 0 ? parseFloat(((todayStat.clicks / todayStat.views) * 100).toFixed(2)) : 0;

    // บอก Mongoose ว่า dailyStats เปลี่ยนแปลง
    ad.markModified('dailyStats');

    await ad.save();

    return true;
  }

async incrementClicks(placeId: string) {
  const ad = await this.adModel.findOne({ placeId });
  if (!ad) {
    console.log('Ad not found for placeId:', placeId);
    return false;
  }

  const today = new Date();
  const dayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  // หา dailyStat ของวันนี้
  let todayStat = ad.dailyStats?.find(ds => {
    const dsKey = `${ds.date.getFullYear()}-${ds.date.getMonth()}-${ds.date.getDate()}`;
    return dsKey === dayKey;
  });

  if (!todayStat) {
    todayStat = { date: today, views: 0, clicks: 0, contacts: 0, bookings: 0, ctr: 0 };
    if (!ad.dailyStats) ad.dailyStats = [];
    ad.dailyStats.push(todayStat);
  }

  // เพิ่ม clicks ทั้งหมดและของวันนี้
  ad.clicks += 1;
  todayStat.clicks += 1;

  // คำนวณ ctr ใหม่
  ad.ctr = ad.views > 0 ? parseFloat(((ad.clicks / ad.views) * 100).toFixed(2)) : 0;
  todayStat.ctr = todayStat.views > 0 ? parseFloat(((todayStat.clicks / todayStat.views) * 100).toFixed(2)) : 0;

  ad.markModified('dailyStats');
  await ad.save();

  return true;
}


async incrementContacts(placeId: string) {
  const ad = await this.adModel.findOne({ placeId });
  if (!ad) return false;

  const today = new Date();
  const dayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  let todayStat = ad.dailyStats?.find(ds => {
    const dsKey = `${ds.date.getFullYear()}-${ds.date.getMonth()}-${ds.date.getDate()}`;
    return dsKey === dayKey;
  });

  if (!todayStat) {
    todayStat = { date: today, views: 0, clicks: 0, contacts: 0, bookings: 0, ctr: 0 };
    if (!ad.dailyStats) ad.dailyStats = [];
    ad.dailyStats.push(todayStat);
  }

  ad.contacts += 1;
  todayStat.contacts += 1;

  ad.markModified('dailyStats');
  await ad.save();
  return true;
}



  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkExpiredAds() {
    const now = new Date();
    const result = await this.adModel.updateMany(
      {
        status: AdStatus.ACTIVE,
        expiredAt: { $lte: now },
      },
      {
        $set: { status: AdStatus.EXPIRED },
      },
    );
    console.log(`${result.modifiedCount} ads expired at ${now}`);
  }
}
