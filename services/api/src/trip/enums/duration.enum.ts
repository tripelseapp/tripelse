export enum DurationsEnum {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long',
  EXTENDED = 'extended',
}

export type Duration = `${DurationsEnum}`;

export const durations = Object.values(DurationsEnum);
