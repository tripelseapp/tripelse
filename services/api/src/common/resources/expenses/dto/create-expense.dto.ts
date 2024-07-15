import { PickType } from '@nestjs/swagger';
import { ExpenseDto } from './expense.dto';

export class CreateExpenseDto extends PickType(ExpenseDto, [
  'id',
  'category',
  'date',
  'description',
  'contributors',
  'currency',
  'attachments',
] as const) {}
