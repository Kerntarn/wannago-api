import { Injectable, NotFoundException, InternalServerErrorException, HttpStatus, HttpException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { ProcessPaymentDto } from './dtos/process-payment.dto';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';
import { TransactionMessages, TransactionStatus } from './transaction.asset';
import { Ad, AdDocument } from '../schemas/ad.schema';
import { PaymentMethod } from './transaction.asset';

@Injectable()
export class TransactionService {

  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Ad.name) private adModel: Model<AdDocument>
  ){}

  async create(userId: string, adId: string, createDto: CreateTransactionDto): Promise<Transaction> {
    try {

      const ad = await this.adModel.findById(adId);
      if (!ad) throw new NotFoundException('Ad not found');

      if (createDto.method === PaymentMethod.CREDIT_CARD) {
        const card = createDto.cardInfo;
        if (!card?.number || !card?.expiry || !card?.cvc || !card?.holder || !card?.email) {
          throw new BadRequestException('Incomplete credit card info');
        }
      }

      const transaction = new this.transactionModel({
        userId: new Types.ObjectId(userId) ,
        adId: new Types.ObjectId(adId) ,
        amount: ad.price,
        status: 'success', // mock payment
        payDate: new Date(),
        method: createDto.method,
        cardInfo: createDto.cardInfo
      });

      await transaction.save();

      // อัปเดต Ad
      ad.status = 'active';
      ad.expireAt = new Date(Date.now() + ad.durationDays * 24*60*60*1000);
      await ad.save();

      const formatted = {
        _id: transaction._id,
        userId: transaction.userId,
        adId: transaction.adId,
        amount: transaction.amount,
        method: transaction.method,
        status:transaction.status,
        payDate: transaction.payDate
      };

      return formatted;
      
    } catch (e) {
      console.error('Error saving transaction:', e);
      throw new InternalServerErrorException({
        message: e.message,
      });
    }
  }
}

