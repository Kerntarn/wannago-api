import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty,
      IsNumber,
      IsPositive,
      IsString,
      IsDateString,
      IsEnum,
      IsMongoId
} from 'class-validator';

import { TransactionStatus,
      PaymentMethod,
      AdvertiserType,
      AdDuration,
} from '../transaction.asset';

export class CreateTransactionDto {

      // @ApiProperty({
      //       description: 'User ID who created the transaction',
      //       example: '64fa1234567890abcdef1234',
      // })
      // @IsMongoId({ message: 'Invalid MongoDB ObjectId' })
      // @IsNotEmpty()
      // userId!: string; 

      @ApiProperty({
            description: 'Aype of advertiser',
            example: AdvertiserType.CARRENTAL,
            enum: AdvertiserType,
      })
      @IsEnum(AdvertiserType, {
            message:`adType must be a valid AdvertiserType value: ${Object.values(AdvertiserType).join(', ')}`,
      })
      @IsNotEmpty({ message: 'adType should not be empty' })
      adType!: AdvertiserType; 

      @ApiProperty({
            description: 'Duration of the ad in days',
            example: AdDuration.DAYS_7,
            enum: AdDuration,
      })
      @IsEnum(AdDuration, {
            message: `adDuration must be one of: ${Object.values(AdDuration).join(', ')}`,
      })
      @IsNotEmpty()
      adDuration!: AdDuration;

      @ApiProperty({
            description: 'Transaction amount',
            example: 50,
      })
      @IsNumber()
      @IsPositive()
      @IsNotEmpty()
      amount!: number;

      @ApiProperty({
            description: 'Payment method',
            example: PaymentMethod.PROMPTPAY,
            enum: PaymentMethod,
      })
      @IsEnum(PaymentMethod, {
            message:'Method must be either Visa, MasterCard, QR Payment, PromptPay or Mobile Banking',
      })
      @IsNotEmpty()
      method!: PaymentMethod;
}