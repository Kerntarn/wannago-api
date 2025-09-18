import { Prop, Schema, SchemaFactory,  } from '@nestjs/mongoose';
import { HydratedDocument, Types }  from 'mongoose';
import { TransactionStatus, PaymentMethod } from '../transaction/transaction.asset';
//what pattern will the data be saved in db
export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({timestamps: true })
export class Transaction {

      @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
      userId: Types.ObjectId;

      @Prop({ required: true, type: Types.ObjectId, ref: 'Ad' })
      adId: Types.ObjectId;

      @Prop({ required: true, type: Number, min: 0 })
      amount: number;

      @Prop({ required: true, enum: ['pending','processing','success','failed','refunded'], default: 'pending' })
      status: TransactionStatus;

      @Prop({ type: Date })
      payDate?: Date;

      @Prop({ required: true, enum: PaymentMethod })
      method: PaymentMethod;

      @Prop({
      type: {
            holder: { type: String },
            email: { type: String },
            number: { type: String },
            expiry: { type: String },
            cvc: { type: String },
      },
      _id: false, // ไม่สร้าง _id 
      })
      cardInfo?: {
            holder?: string;
            email?: string;
            number?: string;
            expiry?: string;
            cvc?: string;
      };

}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);