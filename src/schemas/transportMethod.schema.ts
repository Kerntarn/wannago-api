import { Prop, Schema, SchemaFactory,  } from '@nestjs/mongoose';
import { HydratedDocument , Types } from 'mongoose';

export type TransportMethodDocument = HydratedDocument<TransportMethod>;

@Schema({timestamps: true })
export class TransportMethod {

      @Prop({ required: true })
      name: string;

      @Prop({ required: true })
      description: string;

      @Prop({})
      contactInfo?: string;

      @Prop({default:false})
      hasBooking: boolean;

      @Prop({ required: true })
      price: number;

      @Prop({ required: true })
      speed: number;

      @Prop({ type: Types.ObjectId, ref: 'User' })
      providerId?: Types.ObjectId;

      @Prop({ required: true })
      routeId: string;
      

}

export const TransportMethodSchema = SchemaFactory.createForClass(TransportMethod);