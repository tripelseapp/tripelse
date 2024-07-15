import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Attachment } from 'common/resources/attachments/entity/attachment.entity';
import { Category } from 'common/enums/category.enum';
import { Activity } from './activity.entity';

@Schema()
export class Event extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  category: Category;

  @Prop({ required: true })
  attachment: Attachment[];

  @Prop({ required: true })
  activity: Activity;

  @Prop({ required: true })
  activities: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
