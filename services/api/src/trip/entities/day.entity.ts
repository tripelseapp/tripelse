import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Day extends Document {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  activities: string[];
}

export const DaySchema = SchemaFactory.createForClass(Day);
