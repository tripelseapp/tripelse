import { PickType } from '@nestjs/swagger';
import { ExpenseDto } from './expense.dto';

export class CreateExpenseDto extends PickType(ExpenseDto, [
  'categories',
  'dateTime',
  'description',
  'contributors',
  'currency',
  'attachments',
] as const) {}
