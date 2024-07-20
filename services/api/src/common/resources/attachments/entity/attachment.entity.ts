import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Attachment {
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

export type AttachmentDocument = HydratedDocument<Attachment>;
export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
