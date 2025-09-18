import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

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

        
        const createdUser = new this.userModel({
            email,
            password,
            firstName,
            lastName,
            userName,
            profileImage,
            phoneNumber
        });

        return createdUser.save();
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

    async update(id: string, updateDto: UpdateUserDto): Promise<User> {
        const existingUser = await this.userModel.findById(id);
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        // Prevent updating email or username to an already existing one
        if (updateDto.email && updateDto.email !== existingUser.email) {
            const userWithEmail = await this.userModel.findOne({ email: updateDto.email });
            if (userWithEmail) {
                throw new ConflictException('Email already in use');
            }
        }
        if (updateDto.userName && updateDto.userName !== existingUser.userName) {
            const userWithUsername = await this.userModel.findOne({ userName: updateDto.userName });
            if (userWithUsername) {
                throw new ConflictException('Username already in use');
            }
        }

        // Hash password if it's being updated
        if (updateDto.password) {
            updateDto.password = await bcrypt.hash(updateDto.password, 10);
        }

        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
        return updatedUser;
    }

    async remove(id: string): Promise<User> {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException('User not found');
        }
        return deletedUser;
    }
}
