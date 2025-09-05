import { Prop, Schema, SchemaFactory,  } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TransactionStatus, PaymentMethod } from '../transaction/dtos/create-transaction.dto';
//what pattern will the data be saved in db
export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({timestamps: true })
export class Transaction {

      @Prop({ required: true })
      purpose: string;

      @Prop({ required: true, enum: TransactionStatus, default: TransactionStatus.PENDING })
      status: TransactionStatus;

      @Prop({ required: true, type: Number, min: 0 })
      amount: number;

      @Prop({ type: Date })
      payDate?: Date;

      @Prop({ enum: PaymentMethod })
      method?: PaymentMethod;

      @Prop() //required ObjectId in the future
      puserId: string;
      // @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
      // userId: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);