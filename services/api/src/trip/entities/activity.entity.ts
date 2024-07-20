import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CategoriesEnum } from 'common/enums/category.enum';
import { Attachment } from 'common/resources/attachments/entity/attachment.entity';
import { Expense } from 'common/resources/expenses/entities/expense.entity';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Activity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  dateTime: Date;

  @Prop({ type: [String], required: true })
  categories: CategoriesEnum[];

  @Prop({ type: [Attachment], required: true })
  attachments: Attachment[];

  @Prop({ type: [Expense], required: true })
  expenses: Expense[];
}

export type ActivityDocument = HydratedDocument<Activity>;

export const ActivitySchema = SchemaFactory.createForClass(Activity);
