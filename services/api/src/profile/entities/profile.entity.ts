import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, now } from 'mongoose';

// import { CategoriesEnum } from 'common/enums/category.enum';
import {
  Expense,
  ExpenseSchema,
} from 'common/resources/expenses/entities/expense.entity';
import { Day, DaySchema } from './day.entity';

@Schema()
export class Profile {
  @Prop({ required: true })
  bio: string;

  @Prop({ required: false })
  avatar: string;

  @Prop({ required: true })
  followers: number;

  @Prop({ required: true })
  following: number;

  @Prop({ required: true, default: now() })
  createdAt: Date;

  @Prop({ required: true, default: now() })
  updatedAt: Date;

  @Prop({ type: [DaySchema], default: [] })
  days: Day[];

  @Prop({ type: [ExpenseSchema], default: [] })
  expenses: Expense[];
}

export type ProfileDocument = HydratedDocument<Profile>;

export const ProfileSchema = SchemaFactory.createForClass(Profile);
