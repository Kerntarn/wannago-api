import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ad, AdDocument } from '../schemas/ad.schema';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';
import { Place, PlaceDocument } from '../schemas/place.schema';
import { CreateAdDto } from './dtos/create-ad.dto';

@Injectable()
export class AdService {

  constructor(
    @InjectModel(Ad.name) private adModel: Model<AdDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Place.name) private placeModel: Model<Place>,
  ) {}

  //สร้าง
  async createAd(ownerId: string, createAdDto: CreateAdDto) {
  
    const place = await this.placeModel.create({
      name: createAdDto.name,
      imgaeUrl: createAdDto.images,
      location: createAdDto.location,
      description: createAdDto.description,
      providerId: new Types.ObjectId(ownerId),
      tags: createAdDto.targetAudience
    });

    const ad = await this.adModel.create({
      ...createAdDto,
      owner: new Types.ObjectId(ownerId),
      status: 'draft',
      place: place._id, 
    });

    return {
      _id: ad._id,
      owner: ad.owner,
      place: place._id,
      name: ad.name,
      targetAudience: ad.targetAudience,
      durationDays: ad.durationDays,
      price: ad.price,
      status: ad.status,
      createdAt: ad.createdAt,
      expireAt: ad.expireAt,
    };
  }

  //ads ทั้งหมดเอาไปใส่ตาราง
  async getAllAdsByUser(ownerId: string) {
    const ads = await this.adModel.find({ owner: new Types.ObjectId(ownerId)}).sort({ createdAt: -1 });;
    const formatted = ads.map(ad => ({
      _id: ad._id,
      name: ad.name,
      status: ad.status,
      createdAt: ad.createdAt,
      expireAt: ad.expireAt,
    }));
    return formatted
  }

  //กดลบในตาราง
  async deleteAd(adId: string, ownerId: string) {
    const ad = await this.adModel.findOne({ _id: adId, owner: ownerId });
    if (!ad) {
      throw new NotFoundException('Ad not found or you are not the owner');
    }
    await this.adModel.deleteOne({ _id: adId });
    return { message: 'Ad deleted successfully' };
  }
  
  async getAdStats(adId: string) {
    const ad = await this.adModel.findById(adId);
    if (!ad) throw new NotFoundException('Ad not found');

    const totalViews = ad.views;
    const totalClicks = ad.clicks;
    const totalContacts = ad.contacts;
    const totalBookings = ad.bookings;
    const ctr = totalViews > 0 ? parseFloat(((totalClicks / totalViews) * 100).toFixed(2)) : 0;

    const statsMonthly = await this.getAdStatsMonthly(adId)

    return {
      adId: ad._id,
      name: ad.name,
      total: {
        views: totalViews,
        clicks: totalClicks,
        contacts: totalContacts,
        bookings: totalBookings,
        ctr,
      },
      statsMonthly: statsMonthly
    };
  }

  async getAdStatsMonthly(adId: string) {
    const ad = await this.adModel.findById(adId);
    if (!ad) throw new NotFoundException('Ad not found');

    const stats: Record<string, any> = {};

    const start = new Date(ad.createdAt.getFullYear(), ad.createdAt.getMonth(), 1);
    const end = new Date();
    let current = new Date(start);

    while (current <= end) {
      const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2,'0')}`;
      stats[monthKey] = { 
        adId: ad._id,
        name: ad.name,
        month: monthKey,
        click: 0,
        view: 0,
        ctr: 0,
        contract: 0,
        booking: 0
      };
      current.setMonth(current.getMonth() + 1);
    }

    const createdMonthKey = `${ad.createdAt.getFullYear()}-${String(ad.createdAt.getMonth() + 1).padStart(2,'0')}`;
    stats[createdMonthKey].click = ad.clicks;
    stats[createdMonthKey].view = ad.views;
    stats[createdMonthKey].contract = ad.contacts;
    stats[createdMonthKey].booking = ad.bookings;
    stats[createdMonthKey].ctr = ad.views > 0 ? parseFloat(((ad.clicks / ad.views) * 100).toFixed(2)) : 0;

    return Object.values(stats).sort((a,b) => a.month > b.month ? 1 : -1);
  }

  
  async getAllAdsStats(ownerId: string) {
   
    const ownerObjectId = new Types.ObjectId(ownerId);
    const ads = await this.adModel.find({ owner: ownerObjectId }).sort({ createdAt: -1 });

    if (!ads || ads.length === 0) throw new NotFoundException('No ads found for this user');

    const totalViews = ads.reduce((sum, ad) => sum + ad.views, 0);
    const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
    const totalContacts = ads.reduce((sum, ad) => sum + ad.contacts, 0);
    const totalBookings = ads.reduce((sum, ad) => sum + ad.bookings, 0);
    const ctr = totalViews > 0 ? parseFloat(((totalClicks / totalViews) * 100).toFixed(2)) : 0;

    const statsMonthly = await this.getAllAdsStatsMonthly(ownerId)

    return {
      total: {
        views: totalViews,
        clicks: totalClicks,
        contacts: totalContacts,
        bookings: totalBookings,
        ctr,
      },
      statsMonthly: statsMonthly
    };
  }

  async getAllAdsStatsMonthly(ownerId: string) {
    const ads = await this.adModel.find({ owner: new Types.ObjectId(ownerId) }).sort({ createdAt: 1 });
    if (!ads.length) throw new NotFoundException('No ads found for this user');

    const firstDate = new Date(Math.min(...ads.map(a => a.createdAt.getTime())));
    const endDate = new Date();
    
    const stats: Record<string, any> = {};
    let current = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
    while (current <= endDate) {
      const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2,'0')}`;
      stats[monthKey] = { month: monthKey, click: 0, view: 0, contract: 0, booking: 0, ctr: 0 };
      current.setMonth(current.getMonth() + 1);
    }

    ads.forEach(ad => {
      const monthKey = `${ad.createdAt.getFullYear()}-${String(ad.createdAt.getMonth() + 1).padStart(2,'0')}`;
      stats[monthKey].click += ad.clicks;
      stats[monthKey].view += ad.views;
      stats[monthKey].contract += ad.contacts;
      stats[monthKey].booking += ad.bookings;
    });

    Object.values(stats).forEach(stat => {
      stat.ctr = stat.view > 0 ? parseFloat(((stat.click / stat.view) * 100).toFixed(2)) : 0;
    });

    return Object.values(stats).sort((a,b) => a.month > b.month ? 1 : -1);
  }

  async incrementViews(adId: string) {
    const ad = await this.adModel.findById(adId);
    if (!ad) throw new NotFoundException('Ad not found');

    const ctr = ad.views > 0 ? parseFloat((( ad.clicks / ( ad.views + 1 )) * 100).toFixed(2)) : 0
    const updateAd = await this.adModel.findByIdAndUpdate(adId,{ $inc: { views : 1 }, $set: { ctr }},{ new: true });

    const formatted = {
        _id: updateAd._id,
        owner: updateAd.owner,
        name: updateAd.name,
        views: updateAd.views,
        ctr: updateAd.ctr
      };
    return formatted;
  }

  async incrementClicks(adId: string) {
    const ad = await this.adModel.findById(adId);
    if (!ad) throw new NotFoundException('Ad not found');

    const ctr = ad.views > 0 ? parseFloat((((ad.clicks + 1) / ad.views) * 100).toFixed(2)) : 0
    const updateAd = await this.adModel.findByIdAndUpdate(adId,{ $inc: { clicks: 1 }, $set: { ctr }},{ new: true });

    const formatted = {
        _id: updateAd._id,
        owner: updateAd.owner,
        name: updateAd.name,
        clicks: updateAd.clicks,
        ctr: updateAd.ctr
      };
    return formatted;
  }

  async incrementContacts(adId: string) {
    const ad = await this.adModel.findByIdAndUpdate(adId,{ $inc: { contacts: 1 } }, { new: true });
    const formatted = {
        _id: ad._id,
        owner: ad.owner,
        name: ad.name,
        contacts: ad.contacts
      };
    return formatted;
  }

  async incrementBookings(adId: string) {
   const ad = await this.adModel.findByIdAndUpdate(adId,{ $inc: { bookings: 1 } }, { new: true });
    const formatted = {
        _id: ad._id,
        owner: ad.owner,
        name: ad.name,
        bookings: ad.bookings
      };
      return formatted;
  }
}
