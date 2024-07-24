import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now, Schema as MongooseSchema } from 'mongoose';

import { CategoriesEnum } from 'common/enums/category.enum';
import { Attachment } from 'common/resources/attachments/entity/attachment.entity';
import {
  Expense,
  ExpenseSchema,
} from 'common/resources/expenses/entities/expense.entity';
import { Day, DaySchema } from './day.entity';

@Schema()
export class TripEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop()
  thumbnail: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'UserEntity' }],
    default: [],
  })
  travelers: string[];

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ type: [DaySchema], default: [] })
  days: Day[];

  @Prop({ type: [String], default: [] })
  categories: CategoriesEnum[];

  @Prop({ type: [ExpenseSchema], default: [] })
  expenses: Expense[];

  @Prop({ type: [Attachment], default: [] })
  attachments: Attachment[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'UserEntity' })
  createdBy: string;
}

export type TripDocument = HydratedDocument<TripEntity>;

// export type TripDocument = Trip & Document<Trip>;
export const TripSchema = SchemaFactory.createForClass(TripEntity);
