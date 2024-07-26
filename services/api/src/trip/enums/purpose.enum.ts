export enum PurposesEnum {
  FAMILY = 'family',
  FRIENDS = 'friends',
  ROMANTIC = 'romantic',
  ALONE = 'alone',
  BUSINESS = 'business',
  PARTY = 'party',
}

export type Purpose = `${PurposesEnum}`;

export const purposes = Object.values(PurposesEnum);
