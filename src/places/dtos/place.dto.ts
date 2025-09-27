import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
// What we expect when receiving request

export class CreatePlaceDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsOptional()
    imageUrl?: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsUrl()
    location: string;
    
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