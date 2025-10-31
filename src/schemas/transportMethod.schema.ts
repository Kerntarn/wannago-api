import { Prop, Schema, SchemaFactory,  } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TransportMethodDocument = HydratedDocument<TransportMethod>;

@Schema({timestamps: true, versionKey: false})
export class TransportMethod {

      @Prop({ required: true })
      name: string;

      @Prop({ required: true })
      description: string;

      @Prop({})
      contactInfo?: string;

      @Prop({ default: false })
      hasBooking: boolean;

      @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
      providerId?: mongoose.Types.ObjectId;
}

export const TransportMethodSchema = SchemaFactory.createForClass(TransportMethod);