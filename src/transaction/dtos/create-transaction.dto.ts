import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
      IsOptional,
      IsObject,
      IsEnum,
      IsString,
      IsEmail,
      IsCreditCard,
      Matches
} from 'class-validator';
import { PaymentMethod } from '../transaction.asset';

export class CardInfoDto {
      @ApiProperty({ example: 'John Doe' })
      @IsString()
      holder: string;

      @ApiProperty({ example: 'john@example.com' })
      @IsEmail()
      email: string;

      @ApiProperty({ example: '4111111111111111' })
      @IsCreditCard()
      number: string;

      @ApiProperty({ example: '12/26', description: 'MM/YY format' })
      @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Expiry must be in MM/YY format' })
      expiry: string;

      @ApiProperty({ example: '123' })
      @Matches(/^\d{3,4}$/, { message: 'CVC must be 3 or 4 digits' })
      cvc: string;
}

export class CreateTransactionDto {

      @ApiProperty({
      example: PaymentMethod.CREDIT_CARD,
      description: 'วิธีชำระเงิน',
      enum: PaymentMethod,
      })
      @IsEnum(PaymentMethod)
      method: PaymentMethod;

      @ApiPropertyOptional({
      description: 'ข้อมูลบัตรเครดิต (ถ้าใช้ Credit Card)',
      example: {
            holder: 'John Doe',
            email: 'john@example.com',
            number: '4111111111111111',
            expiry: '12/26',
            cvc: '123',
      }
      })

      @IsOptional()
      @IsObject()
      cardInfo?:CardInfoDto;
}



