import { IsNotEmpty, IsOptional, IsBoolean, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTransportMethodDto {
      @IsNotEmpty()
      @IsString()
      name: string;

      @IsNotEmpty()
      @IsString()
      description: string;

      @IsOptional()
      @IsString()
      contactInfo?: string;

      @IsOptional()
      @IsBoolean()
      hasBooking?: boolean;

      // @IsOptional()
      // providerId?: Types.ObjectId;
      @IsOptional()
      providerId?: string;
}