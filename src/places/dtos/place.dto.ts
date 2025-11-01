import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
// What we expect when receiving request

export class CreatePlaceDto {
    @ApiProperty({ example: "ไก่ย่าง 5 ดาว สาขา ฉลองกรุง1"})
    @IsNotEmpty()
    name: string;
    
    @ApiProperty({ example: "https://q-xx.bstatic.com/xdata/images/hotel/max500/457026415.jpg?k=104fca4a3d71fbc8cda227fdc0c7c39ba97cdd9aee4927bd4419f776a72feb31&o="})
    @IsOptional()
    imageUrl?: string;
    
    @ApiProperty({ example: "[13.7563, 100.5018] or https://maps.app.goo.gl/MfMgEck64HyW5S2D9" })
    @IsNotEmpty()
    location: any; // Allow both string URL and [lat, long]
    
    @ApiProperty({ example: "สถานที่ท่vงเที่ยวที่น่าสนใจสุดๆไปเลย อมก. โคตรจะเบิ้มๆน่ะ" })
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: ["budget"]})
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
  @ApiProperty({ example: "Accommodation", required: false })
  @IsOptional()
  type?: string;
}