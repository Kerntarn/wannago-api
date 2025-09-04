import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}    

    async register(registerDto: RegisterDto) {
        const user = await this.usersService.create(registerDto);
        return {message: 'User registered successfully', user};
    }

    async login(loginDto: LoginDto): Promise<{message: string, token: string}> {
        const user = await this.usersService.findByName(loginDto.name);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
        const payload = { sub: user._id, name: user.name };  // Changed from id to _id
        const token = this.jwtService.sign(payload);
        return {message: 'Login successful', token};
    }
        
}
