import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Req, UseGuards, NotFoundException, BadRequestException} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionMessages } from './transaction.asset';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';




@Controller('ad')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post(':adId/transactions')
  async createTransaction(@CurrentUser() user: any,@Param('adId') adId: string, @Body() createDto: CreateTransactionDto) {
      const userId = user._id;
      const transaction = await this.transactionService.create(userId, adId, createDto);
      return {data: transaction,};
  }
}

