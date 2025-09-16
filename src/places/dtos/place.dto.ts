import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
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
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayMinSize(2, { message: 'Give me longitude and latitude'})
    @ArrayMaxSize(2, { message: 'Give me longitude and latitude'})
    location: number[];
    
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