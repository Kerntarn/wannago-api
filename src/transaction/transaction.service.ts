import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { Transaction, TransactionDocument } from 'src/schemas/transaction.schema';

@Injectable()
export class TransactionService {

  constructor(@InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>) {}

  async create(createDto: CreateTransactionDto): Promise<Transaction> {
    try {
      const transaction = new this.transactionModel(createDto);
      const saved = await transaction.save();
      console.log('Transaction saved:', saved);
      return saved;
    } catch (e) {
      console.error('Error saving transaction:', e);
      throw e;
    }
  }

  async update(id: string, updateDto: UpdateTransactionDto): Promise<Transaction> {
    
    try {
      const updated = await this.transactionModel.findByIdAndUpdate(
        id,
        { $set: updateDto }, // อัปเดตเฉพาะ field ที่ส่งมา
        { new: true, runValidators: true } // return document ใหม่, เช็ค validation
      )
      if (!updated) {
        throw new NotFoundException(`Transaction with id ${id} not found`);
      }
      return updated; 
    } catch(error){
      console.error('Error updating transaction:', error)
      throw error;
    }
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

  async findOne(id: string): Promise<Transaction | null> {
    return this.transactionModel.findById(id).exec();
  }

  async remove(id: string): Promise<Transaction | null> {
    return this.transactionModel.findByIdAndDelete(id).exec();
  }
}
