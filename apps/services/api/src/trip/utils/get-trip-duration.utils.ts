import { DurationsEnum } from '../enums/duration.enum';

export const getTripDuration = (daysAmount: number): DurationsEnum => {
  if (daysAmount <= 3) {
    return DurationsEnum.SHORT;
  }
  if (daysAmount <= 7) {
    return DurationsEnum.MEDIUM;
  }
  return DurationsEnum.LONG;
};
