import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty,
      IsNumber,
      IsPositive,
      IsString,
      IsIn,
      IsDateString,
      IsEnum,
} from 'class-validator';

export enum TransactionStatus {
      PENDING = 'pending',
      ACCEPTED = 'accepted',
      REJECTED = 'rejected',
}

export enum PaymentMethod {
      VISA = 'Visa',
      MASTERCARD = 'MasterCard',
      QR = 'QR Payment',
      PROMPTPAY = 'PromptPay',
      MOBILE = 'Mobile Banking',
}

export class CreateTransactionDto {

      // purpose ของ transaction
      @ApiProperty({
      description: 'Transaction purpose',
      example: 'Payment for hotel adds',
      })
      @IsString()
      @IsNotEmpty()
      purpose!: string;

      // status ของ transaction
      @ApiProperty({
      description: 'Transaction status',
      example: TransactionStatus.PENDING,
      enum: TransactionStatus,
      })
      @IsNotEmpty()
      @IsEnum(TransactionStatus, {
      message: 'Status must be either pending, accepted, or rejected',
      })
      status!: string;

      //จำนวนเงิน
      @ApiProperty({
      description: 'Transaction amount',
      example: 50,
      })
      @IsNumber()
      @IsPositive()
      @IsNotEmpty()
      amount!: number;

      //วันที่จ่าย (optional)
      @ApiProperty({
      description: 'Transaction date',
      example: '2024-01-17T12:00:00Z',
      })
      @IsDateString()
      payDate?: string;

      //วิธีจ่าย (optional)
      @ApiProperty({
      description: 'Transaction method',
      example: PaymentMethod.PROMPTPAY,
      enum: PaymentMethod,
      })
      @IsString()
      @IsEnum(PaymentMethod, {
      message:
            'Method must be either Visa, MasterCard, QR Payment, PromptPay or Mobile Banking',
      })
      method?: string;

      //userId เจ้าของ transaction
      @ApiProperty({
      description: 'User ID associated with this transaction',
      type: String,
      example: '64fa1234567890abcdef1234',
      })
      @IsString()
      @IsNotEmpty()
      userId!: string; 
}