import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Req, UseGuards, NotFoundException} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionMessages } from './transaction.asset';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { ProcessPaymentDto } from './dtos/process-payment.dto';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';




@Controller('ads/transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // สร้าง transaction -> เริ่มซื้อโฆษณา
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post()
  async createTransaction(@CurrentUser() user: any, @Body() createDto: CreateTransactionDto) {
    try {
      const userId = user._id; // Use user._id from CurrentUser decorator
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

  // ดูรายการ transaction ของผู้ใช้
  @Get('user/:userId') 
  async getTransactionsByUser(@Param('userId') userId: string,): Promise<{ data: Transaction[] }> {
    const transactions = await this.transactionService.findByUserId(userId);
    return { data: transactions };
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

