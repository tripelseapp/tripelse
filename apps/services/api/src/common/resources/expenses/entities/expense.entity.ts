import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CategoriesEnum } from 'common/enums/category.enum';
import { Attachment } from 'common/resources/attachments/entity/attachment.entity';
import { HydratedDocument, Schema as MongooseSchema, now } from 'mongoose';

interface Contributor {
  id: string;
  amount: number;
}

@Schema()
export class Expense {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  dateTime: Date;

  @Prop({ required: true })
  currency: string;

  // link the id of a contributor to a User Id
  @Prop({
    type: [
      {
        id: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
        amount: Number,
      },
    ],
  })
  contributors: Contributor[];

  @Prop({ type: [String], required: true })
  categories: CategoriesEnum[];

  @Prop({ type: [Attachment], required: true })
  attachments: Attachment[];

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export type ExpenseDocument = HydratedDocument<Expense>;
export const ExpenseSchema = SchemaFactory.createForClass(Expense);

export const expenseExample: Expense = {
  description: 'The payment for the hotel room',
  dateTime: new Date('2024-06-01T13:24:15.000Z'),
  currency: 'EUR',
  contributors: [
    {
      id: '66885d45750b1ced3b4b6d40',
      amount: 100,
    },
  ],
  categories: [CategoriesEnum.SHOPPING],
  attachments: [],
  createdAt: new Date('2024-06-01T00:00:00.000Z'),
  updatedAt: new Date('2024-06-01T00:00:00.000Z'),
};
