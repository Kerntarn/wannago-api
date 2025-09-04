import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';
//what pattern will the data be saved in db
export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: string;
  @Prop()
  name: string;
  @Prop({ required: true })
  password: string;

}

export const UserSchema = SchemaFactory.createForClass(User);