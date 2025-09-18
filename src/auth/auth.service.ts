import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { identity } from 'rxjs';
import { readFile } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}    

    async register(registerDto: RegisterDto) {
        const user = await this.usersService.create(registerDto);
        return {
            message: 'User registered successfully',
            user:{
                email : user.email,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
            }
        };
    }

    async login(loginDto: LoginDto): Promise<{message: string, token: string}> {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        console.log(user);
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
        const payload = { 
            sub: user._id, 
            email: user.email,
            username: user.userName,
        };  
        const token = this.jwtService.sign(payload);
        return {message: 'Login successful', token};
    }
        
}
