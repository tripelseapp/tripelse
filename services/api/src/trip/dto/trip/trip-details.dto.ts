import { PickType } from '@nestjs/swagger';
import { TripDto } from './trip.dto';
import { CategoriesEnum } from 'common/enums/category.enum';
import { DayExample1, DayExample2 } from '../day/day.dto';

export class TripDetailsDto extends PickType(TripDto, [
  'name',
  'id',
  'description',
  'thumbnail',
  'createdAt',
  'updatedAt',
  'expenses',
  'days',
  'categories',
  'travelers',
  'createdBy',
] as const) {}

export const tripDetailsExample: TripDetailsDto = {
  id: '6695aebd76dcb559c2f56d17',
  name: 'A summer trip to the beach',
  description: 'A complete week of fun and relaxation at the beach.',
  thumbnail: 'https://example.com/image.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
  expenses: [],
  createdBy: {
    id: '6695aebd76dcb559c2f56d17',
    username: 'John Doe',
  },
  days: [DayExample1, DayExample2],
  categories: [CategoriesEnum.ENTERTAINMENT],
  travelers: [],
};
