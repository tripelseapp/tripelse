import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Attachment } from 'src/common/entities/attachment.entity';
import { Category } from 'src/common/enums/category.enum';

@Schema()
export class Activity extends Document {
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
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
