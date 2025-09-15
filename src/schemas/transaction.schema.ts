import { Prop, Schema, SchemaFactory,  } from '@nestjs/mongoose';
import { HydratedDocument, Types }  from 'mongoose';
import { TransactionStatus, PaymentMethod, AdvertiserType, AdDuration } from '../transaction/transaction.asset';
//what pattern will the data be saved in db
export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({timestamps: true })
export class Transaction {

      @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
      userId: Types.ObjectId;

      @Prop({ required: true, enum: AdvertiserType })
      adType: AdvertiserType;

      @Prop({ required: true, enum: AdDuration })
      adDuration: AdDuration; 

      @Prop({ required: true, type: Number, min: 0 })
      amount: number;

      @Prop({ required: true, enum: TransactionStatus, default: TransactionStatus.PENDING })
      status: TransactionStatus;

      @Prop({ required: true, 
            enum: PaymentMethod })
      method: PaymentMethod;

      @Prop({ type: Date })
      payDate?: Date;

      @Prop({ type: Date, 
            index: { expireAfterSeconds: 0 } })
      expiresAt?: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);