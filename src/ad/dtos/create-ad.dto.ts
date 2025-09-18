import { IsString, IsOptional, IsArray, IsNumber, IsUrl, IsNotEmpty, ArrayMaxSize, ArrayMinSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdDto {

    @ApiProperty({ example: 'โรงแรมสวยริมแม่น้ำ', description: 'ชื่อสถานที่' })
    @IsString() 
    @IsNotEmpty({ message: 'name should not be empty' })
    name: string;

    @ApiProperty({ example: 'โรงแรม', description: 'ประเภทสถานที่' })
    @IsString() 
    @IsNotEmpty({ message: 'category should not be empty' })
    category: string;

    @ApiPropertyOptional({ example: 'โรงแรมหรู 5 ดาว ริมแม่น้ำเจ้าพระยา', description: 'คำอธิบาย' })
    @IsOptional() 
    @IsString() 
    description?: string;

    @ApiPropertyOptional({ example: 'ห้องพักพร้อมอาหารเช้า, ฟรี WiFi', description: 'รายละเอียดเพิ่มเติม' })
    @IsOptional() 
    @IsString() 
    details?: string;

    @ApiPropertyOptional({ example: '123 ถนนแม่น้ำ แขวงบางรัก กรุงเทพฯ', description: 'ที่อยู่' })
    @IsOptional() 
    @IsString() 
    address?: string;

    @ApiPropertyOptional({ example: [100.12345, 13.75633], description: 'พิกัด [longitude, latitude]' })
    @IsOptional() 
    @IsArray() 
    @ArrayMinSize(2, { message: 'location must have 2 numbers' })
    @ArrayMaxSize(2, { message: 'location must have 2 numbers' })
    location?: [number, number];

    @ApiPropertyOptional({ example: 'https://examplehotel.com', description: 'เว็บไซต์' })
    @IsOptional() 
    @IsUrl() 
    website?: string;

    @ApiPropertyOptional({ example: ['https://example.com/img1.jpg','https://example.com/img2.jpg'], description: 'รูปภาพ' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true, message: 'Each image must be a string URL' })
    images?: string[];

    @ApiPropertyOptional({ example: 5000, description: 'ราคาโฆษณา' })
    @IsOptional() 
    @IsNumber() 
    price?: number;

    @ApiPropertyOptional({ example: 'ลด 20% สำหรับจองก่อน 1 เดือน', description: 'โปรโมชัน' })
    @IsOptional() 
    @IsString() 
    promotion?: string;

    @ApiPropertyOptional({ example: ['นักท่องเที่ยว','คู่รัก'], description: 'กลุ่มเป้าหมาย' })
    @IsOptional() 
    @IsArray() 
    targetAudience?: string[];

    @ApiProperty({ example: 5, description: 'ระยะเวลาโฆษณา (วัน)' })
    @IsNumber() 
    @IsNotEmpty({ message: 'durationDays should not be empty' })
    durationDays: number;
}