import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { AdStatus } from 'src/ad/ad.asset';

export type AdDocument = HydratedDocument<Ad> & { createdAt: Date; updatedAt: Date };

export class DailyStat {
  @Prop({ required: true })
  date: Date; 

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({ default: 0 })
  contacts: number;

  @Prop({ default: 0 })
  bookings: number;

  @Prop({ default: 0 })
  ctr: number; 
}

@Schema({ timestamps: true })
export class Ad {

  @Prop({ required: true , type: Types.ObjectId, ref: 'User'}) 
  providerId: Types.ObjectId;

  @Prop({ required: true , type: mongoose.Schema.Types.ObjectId, ref: 'Place'})
  placeId: Types.ObjectId;
  
  @Prop({ required: true, type: Number }) 
  durationDays: number;
  
  @Prop({ required: true, type: Number }) 
  price: number; 
  
  @Prop({ type: String, enum: AdStatus, default: AdStatus.PENDING}) 
  status: string;
  
  @Prop() 
  expireAt?: Date;

  @Prop({ default: 0 }) 
  views: number;

  @Prop({ default: 0 }) 
  clicks: number;

  @Prop({ default: 0 }) 
  contacts: number;

  @Prop({ default: 0 }) 
  bookings: number;

  @Prop({ default: 0 }) 
  ctr: number;

  @Prop({ type: [Object], default: [] })
  dailyStats?: DailyStat[];
}

export const AdSchema = SchemaFactory.createForClass(Ad);