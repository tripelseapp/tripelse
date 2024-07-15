import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Attachment extends Document {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
  @Prop({ required: true })
  isFavorite: boolean;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
