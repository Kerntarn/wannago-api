import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ad, AdDocument } from '../schemas/ad.schema';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';
import { CreateAdDto } from './dtos/create-ad.dto';

@Injectable()
export class AdService {

  constructor(
    @InjectModel(Ad.name) private adModel: Model<AdDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  //สร้าง
  async createAd(ownerId: string, createAdDto: CreateAdDto) {
    const ad = await this.adModel.create({...createAdDto, owner: new Types.ObjectId(ownerId), status: 'draft'});
    const formatted = {
      _id: ad._id,
      owner: ad.owner,
      name: ad.name,
      targetAudience: ad.targetAudience,
      durationDays: ad.durationDays,
      price: ad.price,
      status: ad.status,
      createdAt: ad.createdAt,
      expireAt: ad.expireAt,
    };
    return formatted;
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

  async incrementViews(adId: string) {
    const ad = await this.adModel.findByIdAndUpdate(adId,{ $inc: { views: 1 } }, { new: true });
    const formatted = {
        _id: ad._id,
        owner: ad.owner,
        name: ad.name,
        views: ad.views
      };
    return formatted;
  }

  async incrementClicks(adId: string) {
    const ad = await this.adModel.findByIdAndUpdate(adId,{ $inc: { clicks: 1 } }, { new: true });
    const formatted = {
        _id: ad._id,
        owner: ad.owner,
        name: ad.name,
        clicks: ad.clicks
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
