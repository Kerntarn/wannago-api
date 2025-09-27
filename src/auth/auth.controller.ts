import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'User successfully logged in' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
    @Post('guest')
    @ApiOperation({ summary: 'Generate guest token' })
    @ApiResponse({ status: 201, description: 'Guest token successfully generated' })
    async guest(): Promise<{ message: string, token: string }> {
        return this.authService.createGuestToken();
    }
}