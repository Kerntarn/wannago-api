import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean, IsString, IsUrl } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTransportMethodDto {
      @ApiProperty()
      @IsNotEmpty()
      @IsString()
      name: string;
      
      @ApiProperty()
      @IsNotEmpty()
      @IsString()
      description: string;
      
      @ApiProperty()
      @IsOptional()
      @IsString()
      contactInfo?: string;
      
      @ApiProperty()
      @IsOptional()
      @IsBoolean()
      hasBooking?: boolean;
      
      @ApiProperty()
      @IsOptional()
      @IsUrl()
      imageUrl?: string;
      
}