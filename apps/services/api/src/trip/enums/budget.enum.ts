export enum BudgetsEnum {
  LOW = 'low',
  AFFORDABLE = 'affordable',
  EXPENSIVE = 'expensive',
  LUXURY = 'luxury',
}

export type Budget = `${BudgetsEnum}`;

export const budgets = Object.values(BudgetsEnum);
