import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document, SchemaTypes } from 'mongoose';
import { ApiKey } from './api-key.entity';
import { Role } from 'src/shared';

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Prop({ required: true, trim: true })
  firstname: string;

  @Prop({ required: true, trim: true })
  lastname: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true, default: false })
  verified: boolean;

  @Prop({ type: [String], enum: Role, default: [Role.USER] })
  roles: Role[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'ApiKey' })
  apiKey: ApiKey;

  @Prop({ required: true, trim: true })
  password: string;
}

export interface UserDocument extends User, Document {
  comparePassword(userPassword: string): Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  userPassword: string,
): Promise<boolean> {
  return bcrypt.compare(userPassword, this.password);
};

// Pre-save hook to hash the password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
