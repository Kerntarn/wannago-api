import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type GuestDocument = HydratedDocument<Guest>;

@Schema({ timestamps: true })
export class Guest {
  @Prop({ type: String, unique: true, required: true })
  guestId: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }] })
  planIds: mongoose.Types.ObjectId[];
}

export const GuestSchema = SchemaFactory.createForClass(Guest);