import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Attachment } from 'common/resources/attachments/entity/attachment.entity';
import {
  Expense,
  ExpenseSchema,
} from 'common/resources/expenses/entities/expense.entity';
import { Day, DaySchema } from './day.entity';
import { MoodsEnum } from 'trip/enums/mood.enum';
import { PurposesEnum } from 'trip/enums/purpose.enum';
import { BudgetsEnum } from 'trip/enums/budget.enum';
import { DurationsEnum } from 'trip/enums/duration.enum';
import { LogisticsEnum } from 'trip/enums/logistics.enum';

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

  @Prop({ type: [ExpenseSchema], default: [] })
  expenses: Expense[];

  @Prop({ type: [Attachment], default: [] })
  attachments: Attachment[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'UserEntity' })
  createdBy: string;

  @Prop({ type: [String], default: [] })
  moods: MoodsEnum[];

  @Prop({ type: [String], default: [] })
  purposes: PurposesEnum[];

  @Prop({ type: [String], default: [] })
  budgets: BudgetsEnum[];

  @Prop({ type: [String], default: [] })
  durations: DurationsEnum[];

  @Prop({ type: [String], default: [] })
  logistics: LogisticsEnum[];
}

export type TripDocument = HydratedDocument<TripEntity>;

// export type TripDocument = Trip & Document<Trip>;
export const TripSchema = SchemaFactory.createForClass(TripEntity);
