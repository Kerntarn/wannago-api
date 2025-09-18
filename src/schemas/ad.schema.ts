import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AdDocument = HydratedDocument<Ad> & { createdAt: Date; updatedAt: Date };

@Schema({ timestamps: true })
export class Ad {
  
  @Prop({ required: true }) 
  name: string; 

  @Prop({ required: true }) 
  category: string; 

  @Prop() 
  description?: string; 

  @Prop() 
  details?: string; 
  
  @Prop() 
  address?: string; 
  
  @Prop({ type: [Number], default: [0,0] }) 
  location?: [number, number]; // พิกัด [longitude, latitude]
  
  @Prop() 
  website?: string; 
  
  @Prop({ type: [String], default: [] }) 
  images?: string[]; 
  
  @Prop() 
  promotion?: string; 
  
  @Prop({ type: [String], default: [] }) 
  targetAudience?: string[]; 
  
  @Prop({ required: true, type: Number }) 
  durationDays: number; // ระยะเวลาโฆษณา (วัน)
  
  @Prop({ required: true, type: Number }) 
  price: number; 
  
  @Prop({ required: true , type: Types.ObjectId, ref: 'User'}) 
  owner: Types.ObjectId;
  
  @Prop({ type: String, enum: ['draft','pending_payment','active','inactive'], default: 'draft' }) 
  status: string;
  
  @Prop() 
  expireAt?: Date;

  //statics
  @Prop({ default: 0 }) 
  views: number;

  @Prop({ default: 0 }) 
  clicks: number;

  @Prop({ default: 0 }) 
  contacts: number;

  @Prop({ default: 0 }) 
  bookings: number;
}

export const AdSchema = SchemaFactory.createForClass(Ad);