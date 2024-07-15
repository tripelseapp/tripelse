export enum CategoriesEnum {
  FOOD = 'food',
  TRANSPORT = 'transport',
  LODGING = 'lodging',
  TOURISM = 'tourism',
  SHOPPING = 'shopping',
  ENTERTAINMENT = 'entertainment',
  OTHER = 'other',
}

export type Category = `${CategoriesEnum}`;

export const categories = Object.values(CategoriesEnum);
