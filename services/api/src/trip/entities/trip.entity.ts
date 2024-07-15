import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Day, DaySchema } from './day.entity';
import { Expense, ExpenseSchema } from 'src/common/entities/expense.entity';

@Schema()
export class Trip extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  thumbnail: string;

  @Prop({ required: true })
  travelers: string[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ type: [DaySchema], required: true })
  days: Day[];

  @Prop({ type: [ExpenseSchema], required: true })
  expenses: Expense[];
}

export const TripSchema = SchemaFactory.createForClass(Trip);
