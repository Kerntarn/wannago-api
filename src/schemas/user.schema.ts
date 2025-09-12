import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export type UserDocument = User & Document;

@Schema({ 
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      if ('password' in ret) {
        delete ret.password;
      }
      return ret;
    }
  }
})
export class User {
  _id: ObjectId;

  @Prop({ 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  })
  email: string;

  @Prop({ 
    required: true,
    minlength: 8
  })
  password: string;
  
  @Prop({ 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  })
  firstName: string;

  @Prop({ 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  })
  userName: string;

  @Prop({
    default: null
  })
  profileImage?: string;

  @Prop({
    trim: true,
    match: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
  })
  phoneNumber?: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1, userName: 1 });

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  } 
  next();
});
