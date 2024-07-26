export enum MoodsEnum {
  RELAX = 'relax',
  ADVENTURE = 'adventure',
  NATURE = 'nature',
  CULTURE = 'culture',
  CITY = 'city',
  BEACH = 'beach',
  PARTY = 'party',
}

export type Mood = `${MoodsEnum}`;

export const moods = Object.values(MoodsEnum);
