import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean, IsString, IsMongoId, IsNumber } from 'class-validator';

export class CreateTransportMethodDto {

  @ApiProperty({ example: '650e5a2f7a5b9c00123abcd1', description: 'ID ของ route' })
  @IsNotEmpty()
  @IsString()
  routeId: string;

  @ApiProperty({ example: 'Taxi', description: 'ประเภทการเดินทาง เช่น Taxi, Car, Bus' })
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @ApiProperty({ example: 'Fast and reliable taxi service', description: 'รายละเอียดการเดินทาง' })
  @IsNotEmpty()
  @IsString()
  description: string;
  
  @ApiProperty({ example: '+66 1234 5678', description: 'ข้อมูลติดต่อ', required: false })
  @IsOptional()
  @IsString()
  contactInfo?: string;
  
  @ApiProperty({ example: true, description: 'สามารถจองล่วงหน้าได้หรือไม่', required: false })
  @IsOptional()
  @IsBoolean()
  hasBooking?: boolean;
  
  @ApiProperty({ example: '650e5a2f7a5b9c00123abcd2', description: 'ID ของผู้ให้บริการ', required: false })
  @IsOptional()
  @IsMongoId()
  providerId?: string;

  @ApiProperty({ example: 12.5, description: 'ระยะทางของเส้นทาง (กิโลเมตร)' })
  @IsNotEmpty()
  @IsNumber()
  distance: number;

  @ApiProperty({ example: 25, description: 'ระยะเวลาในการเดินทาง (นาที)' })
  @IsNotEmpty()
  @IsNumber()
  duration:number;

}
