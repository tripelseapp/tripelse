import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Trip {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  updatedAt: Date;
  @Prop({ required: true })
  createdAt: Date;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
