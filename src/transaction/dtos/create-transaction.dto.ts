import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
      IsOptional,
      IsObject,
      IsEnum,
      IsString,
      IsEmail,
      IsCreditCard,
      Matches,
      IsNotEmpty,
      ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../transaction.asset';

export class CardInfoDto {
      @ApiProperty({ example: 'John Doe' })
      @IsNotEmpty({ message: "holder's name should not be empty"})
      @IsString()
      holder: string;

      @ApiProperty({ example: 'john@example.com' })
      @IsNotEmpty({ message: 'email should not be empty' })
      @IsEmail()
      email: string;

      @ApiProperty({ example: '4111111111111111' })
      @IsNotEmpty({ message: 'card number should not be empty' })
      @IsCreditCard()
      number: string;

      @ApiProperty({ example: '12/26', description: 'MM/YY format' })
      @IsNotEmpty({ message: 'expiry should not be empty' })
      @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Expiry must be in MM/YY format' })
      expiry: string;

      @ApiProperty({ example: '123' })
      @IsNotEmpty({ message: 'cvc should not be empty' })
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
                  cvc: '123',}
      })
      @IsObject()
      @ValidateNested()  
      @Type(() => CardInfoDto) 
      cardInfo?: CardInfoDto;
}

// {
//   "method": "CREDIT_CARD",
//   "cardInfo": {
//     "holder": "John Doe",
//     "email": "john@example.com",
//     "number": "4111111111111111",
//     "expiry": "12/26",
//     "cvc": "123"
//   }
// }


