import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto, 
      TransactionStatus, 
      PaymentMethod } from './create-transaction.dto';
import { IsOptional, 
      IsEnum, 
      IsNumber, 
      IsPositive, 
      IsDateString } from 'class-validator';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
      
      //update status
      @ApiProperty({
            description: 'Transaction status',
            example: TransactionStatus.ACCEPTED,
            enum: TransactionStatus,
            required: false,
      })
      @IsOptional()
      @IsEnum(TransactionStatus, {
            message: 'Status must be either pending, accepted, or rejected',
      })
      status?: TransactionStatus;

      //update method
      @ApiProperty({
            description: 'Transaction method',
            example: PaymentMethod.PROMPTPAY,
            enum: PaymentMethod,
            required: false,
      })
      @IsOptional()
      @IsEnum(PaymentMethod, {
            message: 'Method must be either Visa, MasterCard, QR Payment, PromptPay or Mobile Banking',
      })
      method?: PaymentMethod;

      //update payDate
      @ApiProperty({
            description: 'Transaction pay date',
            example: '2025-09-03T12:00:00Z',
            required: false,
      })
      @IsOptional()
      @IsDateString()
      payDate?: string;
}
