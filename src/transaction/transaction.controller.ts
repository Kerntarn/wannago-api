import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionMessages } from './transaction.asset';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create')
  async createTransaction(@Body() createDto: CreateTransactionDto) {
    const transaction = await this.transactionService.create(createDto);
    return {
      message: TransactionMessages.TRANSACTION_CREATED,
      status: HttpStatus.CREATED,
      data: transaction,
    };
  }
  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Patch('accept-transaction/:id')
  async acceptTransaction(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    const { status, payDate } = updateTransactionDto;
    const transUpdatedStatus = await this.transactionService.update(id, { status, payDate });
    //Todo: addTransactionToAccounts
    // await this.transactionService.addTransactionToAccounts({
      //   transaction: transactionUpdatedStatus,
      //   status: 'accepted',
      // });
      return {
        message: TransactionMessages.TRANSACTION_ACCEPTED,
        status: HttpStatus.OK,
        data: transUpdatedStatus,
      };
  }
  
  @Patch('reject-transaction/:id')
  async rejectTransaction(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    const { status } = updateTransactionDto;
    const transUpdatedStatus = await this.transactionService.update(id, { status });

    //Todo: addTransactionToAccounts
    // await this.transactionService.addTransactionToAccounts({
    //   transaction: transactionUpdated,
    //   status: 'rejected',
    // });
    return {
      message: TransactionMessages.TRANSACTION_REJECTED,
      status: HttpStatus.OK,
      data: transUpdatedStatus,
    };
  }

  @Patch('change-payment-method/:id')
  async changePaymentMethod(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    const { method } = updateTransactionDto;
    const transChangedMethod = await this.transactionService.update(id, { method });
    return {
      message: TransactionMessages.TRANSACTION_UPDATED,
      status: HttpStatus.OK,
      data: transChangedMethod,
    };
  }

  
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(id, updateTransactionDto);
  }
  @Delete(':id')
  async removeTransaction(@Param('id') id: string) {
    const deleted = await this.transactionService.remove(id);
    return {
      message: TransactionMessages.TRANSACTION_DELETED,
      status: HttpStatus.OK,
      data: deleted,
    };
  }
}
