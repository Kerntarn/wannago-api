import { IsString, IsNumber, Length, Min, Max } from 'class-validator';

export class ProcessPaymentDto {
  @IsString()
  transactionId: string;

  // ข้อมูลบัตรเครดิต
  @IsString()
  @Length(16, 16, { message: 'Card number must be 16 digits' })
  cardNumber: string;

  @IsString()
  cardHolder: string;

  @IsNumber()
  @Min(1)
  @Max(12)
  expiryMonth: number;

  @IsNumber()
  @Min(2023) 
  expiryYear: number;

  @IsString()
  @Length(3, 4, { message: 'CVV must be 3 or 4 digits' })
  cvv: string;

}