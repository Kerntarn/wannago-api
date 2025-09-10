import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../schemas/user.schema';

export class CreateUserDto {
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

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 8 })
    @IsString()
    @Length(8)
    password: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    profileImage?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsPhoneNumber()
    phoneNumber?: string;

    @ApiPropertyOptional({ enum: UserRole, default: UserRole.USER })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}