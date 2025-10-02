import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
// What we expect when receiving request

export class CreatePlaceDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsOptional()
    imageUrl?: string;
    
    // @ApiProperty()
    // @IsNotEmpty()
    // @IsUrl()
    // location: string;

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(2) // ต้องมีอย่างน้อย 2 ค่า
    @ArrayMaxSize(2) // ไม่เกิน 2 ค่า
    @Type(() => Number)
    @IsNumber({}, { each: true }) // ตรวจสอบว่าเป็นตัวเลขทั้งหมด
    location: number[]; // [longitude, latitude]
    
    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    tags: string[];
}

export class UpdatePlaceDto {
    @ApiProperty()
    @IsOptional()
    name?: string;
    
    @ApiProperty()
    @IsOptional()
    imageUrl?: string;

    @ApiProperty()
    @IsOptional()
    description?: string;

    @ApiProperty()
    tags: string[];
}

export class FindPlaceQueryDto {
  @IsOptional()
  @IsString()
  type?: string;
}