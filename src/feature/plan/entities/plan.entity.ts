import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Plan extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ trim: true })
  tag: string;

  @Prop()
  durationInMonths: number;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: false })
  unlimited: boolean;

  @Prop({ default: 0 })
  monthlyApiCallLimit: number;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);

// Pre-save hook to create planId
PlanSchema.pre('save', function (next) {
  this.tag = this.name.toLowerCase().replace(' ', '_');
  next();
});
