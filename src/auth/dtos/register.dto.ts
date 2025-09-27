import { IsEmail, IsString, Length, MinLength, IsOptional, IsPhoneNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Match } from '../decorators/match.decorator';

export class RegisterDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;
    
    @ApiProperty({ minLength: 2, maxLength: 50 })
    @IsString()
    @Length(2, 50)
    firstName: string;

    @ApiProperty({ minLength: 2, maxLength: 50 })
    @IsString()
    @Length(2, 50)
    lastName: string;

    @ApiProperty({ minLength: 3, maxLength: 30 })
    @IsString()
    @Length(3, 30)
    userName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    profileImage?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsPhoneNumber('TH')
    phoneNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    planId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    guestToken?: string;
}