import { PickType } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto';

export class UpdateExpenseDto extends PickType(CreateExpenseDto, [] as const) {}
