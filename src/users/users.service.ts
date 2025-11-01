import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from '../schemas/user.schema';
import { RegisterDto } from 'src/auth/dtos/register.dto';

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
            phoneNumber,
            isProvider
        } = registerDto;

        const existingUser = await this.userModel.findOne({
            $or: [{ email }, { userName }]
        });
        if (existingUser) {
            throw new ConflictException('Email or username already exists');
        }

        let role = registerDto.isProvider ? UserRole.PROVIDER : UserRole.USER;
        const createdUser = new this.userModel({
            email,
            password,
            firstName,
            lastName,
            userName,
            profileImage,
            phoneNumber,
            role
        });

        return createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) return null;
        return user.toObject();
    }

    async findByUsername(userName: string): Promise<User | null> {
        return this.userModel.findOne({ userName }).exec();
    }
    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }


    async remove(id: string): Promise<User> {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException('User not found');
        }
        return deletedUser;
    }

    async update(id: string, updateUserDto: any): Promise<User> {
        const existingUser = await this.userModel.findById(id).exec();
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        Object.assign(existingUser, updateUserDto);
        return existingUser.save();
    }
}
