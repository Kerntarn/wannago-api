import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { ProcessPaymentDto } from './dtos/process-payment.dto';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';
import { TransactionMessages, TransactionStatus } from './transaction.asset';
import { UsersService } from '../users/users.service';

@Injectable()
export class TransactionService {

  constructor(
    @InjectModel(Transaction.name) 
    private transactionModel: Model<TransactionDocument>,
    private readonly usersService: UsersService
  ){}

  async create(userId: string, createDto: CreateTransactionDto): Promise<Transaction> {

    // const user = await this.usersService.findById(userId);
    // if (!user) throw new NotFoundException('User not found');
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 นาที

      const transaction = new this.transactionModel({
        userId,
        adType: createDto.adType,
        adDuration: createDto.adDuration,
        amount: createDto.amount,
        method: createDto.method,
        status: TransactionStatus.PENDING,
        expiresAt,
      });

      await transaction.save();
      return transaction;
    } catch (e) {
      console.error('Error saving transaction:', e);
      throw new InternalServerErrorException('ไม่สามารถสร้างรายการได้');
    }
  }

  async processPayment(dto: ProcessPaymentDto) {
    const transaction = await this.transactionModel.findById(dto.transactionId);
    if (!transaction) throw new NotFoundException('Transaction not found');

    // Mock payment ถ้า cardNumber เริ่มด้วย '1' => จ่ายสำเร็จ
    const isPaymentSuccess = dto.cardNumber.startsWith('1');
    transaction.status = isPaymentSuccess ? TransactionStatus.SUCCESS : TransactionStatus.FAILED;

    if (isPaymentSuccess) {
      transaction.status = TransactionStatus.SUCCESS;
      transaction.payDate = new Date();
      await transaction.save();
    } else {
      transaction.status = TransactionStatus.FAILED;
      await transaction.save();
    }
    return transaction;
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    const transactions = await this.transactionModel.find({ userId }).exec();
    if (!transactions || transactions.length === 0) {
      throw new NotFoundException('No transactions found for this user');
    }
    return transactions;
  }

  async update(id: string, updateDto: UpdateTransactionDto): Promise<Transaction> {
    try {
      const updated = await this.transactionModel.findByIdAndUpdate(
        id,
        { $set: updateDto }, // อัปเดตเฉพาะ field ที่ส่งมา
        { new: true, runValidators: true } // return document ใหม่, เช็ค validation
      )
      if (!updated) {
        throw new NotFoundException(TransactionMessages.TRANSACTION_NOT_FOUND);
      }
      return updated; 
    } catch(error){
      console.error('Error updating transaction:', error)
      throw error;
    }
  }

  async remove(id: string): Promise<Transaction | null> {
    const deleted = await this.transactionModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(TransactionMessages.TRANSACTION_NOT_FOUND);
    }
    return deleted
  }

  async findOne(id: string): Promise<Transaction| null> {
    return this.transactionModel.findById(id).exec();
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

}
