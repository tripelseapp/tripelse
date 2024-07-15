import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Event } from './event.entity';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Day {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Event' }] })
  events: Event[]; // Replace `any` with the appropriate type
}
export type DayDocument = Day & Document;

export const DaySchema = SchemaFactory.createForClass(Day);
