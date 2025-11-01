import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place, PlaceDocument } from 'src/schemas/place.schema';
import {
  TransportMethod,
  TransportMethodDocument,
} from 'src/schemas/transportMethod.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { mockBangkokAdventurePlaces } from 'src/places/mock-bangkok-adventure-places';
import { mockChiangmaiPlaces } from 'src/places/mock-chiangmai-places';
import { mockIsanPlaces } from 'src/places/mock-isan-places';
import { mockPlaces } from 'src/places/mock-places';
import { Attraction, attractionDocument } from 'src/schemas/attraction.schema';
import { Restaurant, RestaurantDocument } from 'src/schemas/restaurant.schema';
import { Accommodation, accommodationDocument } from 'src/schemas/accommodation.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Place.name) private placeModel: Model<PlaceDocument>,
    @InjectModel(Attraction.name) private attractionModel: Model<attractionDocument>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<RestaurantDocument>,
    @InjectModel(Accommodation.name) private accommodationModel: Model<accommodationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(TransportMethod.name)
    private transportModel: Model<TransportMethodDocument>,
  ) {}
  // use 'npm run seed'
  async run() {
    // await Promise.all([
    //   this.userModel.deleteMany({}), // Commented out based on user feedback
    //   this.placeModel.deleteMany({}), // Commented out based on user feedback
    //   this.transportModel.deleteMany({}), // Commented out based on user feedback
    // ]);

    console.log('🗑️ Old data will not be deleted'); // Updated message
    
    const adminUser = await this.userModel.findOneAndUpdate(
      { email: '66010270@kmitl.ac.th' },
      {
        $set: {
          email: '66010270@kmitl.ac.th',
          role: 'admin',
          password:
            (await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)) || 'admin',
          firstName: 'Admin',
          lastName: 'Naja',
          userName: 'admin001',
        },
      },
      { upsert: true, new: true }
    );
    const adminId = adminUser._id;
    console.log(`Admin ID: ${adminId}`);

    const allMockPlaces = [
      ...mockBangkokAdventurePlaces,
      ...mockChiangmaiPlaces,
      ...mockIsanPlaces,
      ...mockPlaces,
    ];

    for (const placeData of allMockPlaces) {
      console.log(`Processing place: ${placeData.name} with _id: ${placeData._id} and type: ${placeData.type}`);
      let model;
      switch (placeData.type) {
        case 'attraction':
          model = this.attractionModel;
          break;
        case 'restaurant':
          model = this.restaurantModel;
          break;
        case 'accommodation':
          model = this.accommodationModel;
          break;
        default:
          model = this.placeModel;
      }
      const placeResult = await model.findOneAndUpdate(
        { _id: placeData._id }, // Use _id to find and update
        { $set: { ...placeData, providerId: adminId } },
        { upsert: true, new: true }
      );
      console.log(`Place findOneAndUpdate result for ${placeData.name}:`, placeResult);
    }
    
    // Using findOneAndUpdate for transport methods as well
    const mockTransportMethods = [
      {
        name: 'รถยนต์ส่วนตัว',
        description: 'สำหรับคนที่มีรถยนต์ส่วนตัวและขับขี่เดินทางด้วยตัวเอง',
        hasBooking: false,
        providerId: adminId,
      },
      {
        name: 'taxi',
        description: 'บริการรถแท็กซี่ หรือเรียกผ่านแอป',
        hasBooking: false,
        providerId: adminId,
      },
    ];

    for (const transportData of mockTransportMethods) {
      const transportResult = await this.transportModel.findOneAndUpdate(
        { name: transportData.name }, // Use name to find and update
        { $set: { ...transportData, providerId: adminId } },
        { upsert: true, new: true }
      );
      console.log(`Transport findOneAndUpdate result for ${transportData.name}:`, transportResult);
    }

    console.log('✅ data seeded successfully');
  }
}
