export enum CategoriesEnum {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  LODGING = 'LODGING',
  TOURISM = 'TOURISM',
  SHOPPING = 'SHOPPING',
  ENTERTAINMENT = 'ENTERTAINMENT',
  OTHER = 'OTHER',
}

export type Category = `${CategoriesEnum}`;

export const categories = Object.values(CategoriesEnum);
