// src/seed/seed.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place, PlaceDocument } from 'src/schemas/place.schema';
import { TransportMethod, TransportMethodDocument } from 'src/schemas/transportMethod.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Place.name) private placeModel: Model<PlaceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(TransportMethod.name) private transportModel: Model<TransportMethodDocument>,
  ) {}

  async run() {
    await Promise.all([
        this.userModel.deleteMany({}),
        this.placeModel.deleteMany({}),
        this.transportModel.deleteMany({}),
    ]);

    console.log('🗑️ Old data deleted');

    const users = await this.userModel.insertMany([
        { email: '66010270@kmitl.ac.th', role: 'admin', password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10) || 'admin', firstName: 'Admin', lastName: 'Naja', userName: 'admin001' },
    ])
    const adminId = users[0]._id;
    await this.placeModel.insertMany([
      { name: 'Shabu Party', location: [13.7225906, 100.7783234], description: 'ชาบูร้านแจ่มย่านลาดกระบัง', providerId: adminId, type: 'Restaurant', openingHours: '1970-01-01T07:00:00+07:00', closingHours: '1970-01-01T23:30:00+07:00', contactInfo: 'ig:shabu_party', cuisineType: 'Suki Buffet' },
      { name: 'ร้านไก่จีน', location: [13.727688, 100.7715763], description: 'ร้านไก่จีนย่านลาดกระบัง', providerId: adminId, type: 'Restaurant', openingHours: '1970-01-01T11:00:00+07:00', closingHours: '1970-01-01T22:00:00+07:00', contactInfo: 'ig:J3K_chicken', cuisineType: 'Chinese Fried Chicken' },
      { name: 'อุทยานแห่งชาติเขาใหญ่', location: [14.3109281, 101.5278666], description: 'อุทยานที่โด่งดังที่เขาว่ากันอ่ะ', providerId: adminId, type: 'Attraction', entryFee: 40 },
      { name: 'ทะเลบางแสน', location: [13.4856867, 101.0405108], description: 'ทะเลที่คนเยอะชิบหาย หนึ่งในทะเลที่คนนึกถึงบ่อยที่สุด', providerId: adminId, type: 'Attraction', entryFee: 0 },
      { name: 'หอพักบ้านสบาย', location: [13.7263258, 100.7708484,20], description: 'หอพักที่มีบรรยากาศดีและราคาไม่แพง สุดยอดสุดๆไปเลย', providerId: adminId, type: 'Accommodation', starRating: 0, facilities: ['5G wifi'] },
    ]);

    await this.transportModel.insertMany([
        { name: 'รถยนต์ส่วนตัว', description: 'สำหรับคนที่มีรถยนต์ส่วนตัวและขับขี่เดินทางด้วยตัวเอง', hasBooking: false, providerId: adminId }, //averageSpeed: 80, costPerKm: 2, ?
        { name: 'taxi', description: 'บริการรถแท็กซี่ หรือเรียกผ่านแอป', hasBooking: false, providerId: adminId }, //averageSpeed: 60, costPerKm: 5, 
    ])

    console.log('✅ data seeded successfully');
  }
}
