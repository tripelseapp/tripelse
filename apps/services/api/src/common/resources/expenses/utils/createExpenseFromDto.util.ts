import { CreateExpenseDto } from '../dto/create-expense.dto';
import { Expense } from '../entities/expense.entity';

export const createExpenseFromDto = (
  createExpenseDto: CreateExpenseDto,
): Expense => {
  const { ...dto } = createExpenseDto;
  return {
    ...dto,
    contributors: dto.contributors.map((contributor) => ({
      id: contributor.id,
      amount: contributor.amount,
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
