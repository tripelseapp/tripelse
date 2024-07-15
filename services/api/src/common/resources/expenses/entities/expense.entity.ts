import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface Contributor {
  id: string;
  name: string;
  amount: number;
}

@Schema()
export class Expense extends Document {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  contributors: Contributor[];

  @Prop()
  category: string;

  @Prop()
  attachments: string[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
