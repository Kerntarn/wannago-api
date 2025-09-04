import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
    
    async create(registerDto: RegisterDto): Promise<User> {
        const {name, password} = registerDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = new this.userModel({
            name,
            password: hashedPassword,
        });
        return createdUser.save();
    }

    async findByName(name: string): Promise<User | null> {
        return this.userModel.findOne({name}).exec();
    }
} 