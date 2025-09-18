import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { Ad, AdSchema } from '../schemas/ad.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    MongooseModule.forFeature([{ name: Ad.name, schema: AdSchema }]),
    UsersModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService, MongooseModule]

})
export class TransactionModule {}

