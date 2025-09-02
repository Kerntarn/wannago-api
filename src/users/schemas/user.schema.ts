import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';
//what pattern will the data be saved in db
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({required: true})
    username: string;   
    @Prop({required: true})
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);