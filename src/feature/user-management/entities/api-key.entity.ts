import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from './user.entity';

@Schema({ timestamps: true, versionKey: false })
export class ApiKey extends Document {
  @Prop({ isRequired: true, unique: true })
  key: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', unique: true })
  user: User;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
