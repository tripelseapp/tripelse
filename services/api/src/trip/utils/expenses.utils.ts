import { TripDocument } from '../entities/trip.entity';

export const sumAllExpenses = (trip: TripDocument): number => {
  const expensesArray = trip.expenses || [];
  const tripExpenses = expensesArray.reduce(
    (acc, curr) =>
      acc + curr.contributors.map((c) => c.amount).reduce((a, c) => a + c, 0),
    0,
  );

  return tripExpenses;
};
