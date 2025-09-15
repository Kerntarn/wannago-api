import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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
    imgaeUrl?: string;
    
    @ApiProperty()
    @IsOptional()
    description?: string;

}

export class FindPlaceQueryDto {
  @IsOptional()
  @IsString()
  type?: string;
}