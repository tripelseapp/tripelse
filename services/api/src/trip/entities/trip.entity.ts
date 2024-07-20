import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, now } from 'mongoose';

import { CategoriesEnum } from 'common/enums/category.enum';
import {
  Expense,
  ExpenseSchema,
} from 'common/resources/expenses/entities/expense.entity';
import { Day, DaySchema } from './day.entity';
import { Attachment } from 'common/resources/attachments/entity/attachment.entity';

@Schema()
export class Trip {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop()
  thumbnail: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
  travelers: string[];

  @Prop({ required: true, default: now() })
  createdAt: Date;

  @Prop({ required: true, default: now() })
  updatedAt: Date;

  @Prop({ type: [DaySchema], default: [] })
  days: Day[];

  @Prop({ type: [String], default: [] })
  categories: CategoriesEnum[];

  @Prop({ type: [ExpenseSchema], default: [] })
  expenses: Expense[];

  @Prop({ type: [Attachment], default: [] })
  attachments: Attachment[];
}

export type TripDocument = HydratedDocument<Trip>;

// export type TripDocument = Trip & Document<Trip>;
export const TripSchema = SchemaFactory.createForClass(Trip);
