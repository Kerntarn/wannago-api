import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Guest, GuestDocument } from 'src/schemas/guest.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GuestService {
  constructor(
    @InjectModel(Guest.name) private guestModel: Model<GuestDocument>,
  ) {}

  async createGuest(): Promise<Guest> {
    const guestId = uuidv4();
    const newGuest = new this.guestModel({ guestId, planIds: [] });
    return newGuest.save();
  }

  async addPlanToGuest(guestId: string, planId: any): Promise<Guest> {
    return this.guestModel.findOneAndUpdate(
      { guestId },
      { $push: { planIds: planId } },
      { new: true },
    );
  }

  async findGuest(guestId: string): Promise<GuestDocument | null> {
    return this.guestModel.findOne({ guestId }).exec();
  }
}