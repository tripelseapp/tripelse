import { TripDocument } from 'trip/entities/trip.entity';
import { BudgetsEnum } from '../enums/budget.enum';
import { sumAllExpenses } from './expenses.utils';

export const getTripBudget = (trip: TripDocument): BudgetsEnum => {
  const expensesAmount = sumAllExpenses(trip);
  if (expensesAmount <= 500) {
    return BudgetsEnum.LOW;
  }
  if (expensesAmount <= 1000) {
    return BudgetsEnum.AFFORDABLE;
  }
  if (expensesAmount <= 2000) {
    return BudgetsEnum.EXPENSIVE;
  }
  return BudgetsEnum.LUXURY;
};
