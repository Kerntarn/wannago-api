import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Req, UseGuards, NotFoundException} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionMessages } from './transaction.asset';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { ProcessPaymentDto } from './dtos/process-payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';



@Controller('ads/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // สร้าง transaction -> เริ่มซื้อโฆษณา
  @UseGuards(JwtAuthGuard) //NICK
  @Post() 
  async createTransaction(@Req() req, @Body() createDto: CreateTransactionDto) {
    try {
      const userId = req.user.id;
      const transaction = await this.transactionService.create(userId, createDto);
      return {
        data: transaction,
      };
    } catch (error) {
      return {
        message: 'Failed to create transaction',
      };
    }
  }
  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  //จ่ายเงิน
  @Post(':transactionId/process-payment')
  async processPayment(@Body() dto: ProcessPaymentDto) {
    const transaction = await this.transactionService.processPayment(dto);
    return { data: transaction };
  }

  // ดู transaction เดี่ยว
  @Get(':transactionId') 
  async getTransaction(@Param('transactionId') transactionId: string): Promise<{ data: Transaction }> {
    const transaction = await this.transactionService.findOne(transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return { data: transaction };
  }

  // ดูรายการ transaction ของผู้ใช้
  @Get('user/:userId') 
  async getTransactionsByUser(@Param('userId') userId: string,): Promise<{ data: Transaction[] }> {
    const transactions = await this.transactionService.findByUserId(userId);
    return { data: transactions };
  }


  @Delete(':transactionId')
  async removeTransaction(@Param('transactionId') id: string) {
    const deleted = await this.transactionService.remove(id);
    return {
      message: TransactionMessages.TRANSACTION_DELETED,
      status: HttpStatus.OK,
      data: deleted,
    };
  }

  @Patch(':transactionId')
  update(@Param('transactionId') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(id, updateTransactionDto);
  }

}

