import { IsString, IsOptional, IsNumber, IsNotEmpty, IsMongoId, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTransactionDto } from 'src/transaction/dtos/create-transaction.dto';
import { Type } from 'class-transformer';

export class RenewAdDto {

  @ApiProperty({ example: 5, description: 'Duration of the ad in days' })
  @IsNumber({}, { message: 'durationDays must be a valid number' })
  @IsNotEmpty({ message: 'durationDays should not be empty' })
  durationDays: number;

  @ApiPropertyOptional({ example: 5000, description: 'Price of the ad' })
  @IsNumber({}, { message: 'price must be a valid number' })
  @IsNotEmpty({ message: 'price should not be empty' })
  price: number;

  @ApiProperty({ type: CreateTransactionDto, description: 'Transaction details' })
  @IsNotEmpty({ message: 'transaction should not be empty' })
  @IsObject({ message: 'transaction must be an object' })
  @ValidateNested()  
  @Type(() => CreateTransactionDto)  
  transaction: CreateTransactionDto;
}