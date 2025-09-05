import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
    
    async create(registerDto: RegisterDto): Promise<User> {
        const { 
            email, 
            password, 
            firstName, 
            lastName, 
            userName, 
            profileImage, 
            phoneNumber 
        } = registerDto;

        const existingUser = await this.userModel.findOne({
            $or: [{ email }, { userName }]
        });
        if (existingUser) {
            throw new ConflictException('Email or username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const createdUser = new this.userModel({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            userName,
            profileImage,
            phoneNumber
        });

        return createdUser.save();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findByUsername(userName: string): Promise<User | null> {
        return this.userModel.findOne({ userName }).exec();
    }
}