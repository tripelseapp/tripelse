import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { CategoriesEnum } from 'common/enums/category.enum';
import {
  Expense,
  ExpenseSchema,
} from 'common/resources/expenses/entities/expense.entity';
import { Day, DaySchema } from './day.entity';

@Schema()
export class Trip {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop()
  thumbnail: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  travelers: string[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ type: [DaySchema], required: true })
  days: Day[];

  @Prop({ type: [String], required: true })
  categories: CategoriesEnum[];

  @Prop({ type: [ExpenseSchema], required: true })
  expenses: Expense[];
}
export type TripDocument = Trip & Document<Trip>;
export const TripSchema = SchemaFactory.createForClass(Trip);
