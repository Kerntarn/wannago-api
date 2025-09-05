import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;
}
