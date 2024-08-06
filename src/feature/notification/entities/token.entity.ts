import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Token extends Document {
  @Prop({ required: true, trim: true, unique: true })
  token: string;

  @Prop({ trim: true })
  subject: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export interface TokenDocument extends Token, Document {
  verifyToken(): boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

// Method to check if token is expiered
TokenSchema.methods.verifyToken = function (): boolean {
  return new Date() > this.expiresAt;
};
