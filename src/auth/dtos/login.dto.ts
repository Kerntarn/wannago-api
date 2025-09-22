import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    planId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    guestToken?: string;
}
