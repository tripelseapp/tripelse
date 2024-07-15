import { PickType } from '@nestjs/swagger';
import { TripDto } from './trip.dto';
import { CategoriesEnum } from 'common/enums/category.enum';

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
] as const) {}

export const TripDetailsExample: TripDetailsDto = {
  name: 'A summer trip to the beach',
  description: 'A complete week of fun and relaxation at the beach.',
  thumbnail: '',
  travelers: [],
  createdAt: '2024-07-15T23:20:29.399Z',
  updatedAt: '2024-07-15T23:20:29.399Z',
  days: [
    {
      date: '2024-06-01T00:00:00.000Z',
      name: 'Day 1',
      description: '',
      createdAt: '2024-07-15T23:20:01.290Z',
      updatedAt: '2024-07-15T23:20:01.290Z',
      events: [],
      id: '6695aebd76dcb559c2f56d17',
    },
    {
      date: '2024-06-02T00:00:00.000Z',
      name: 'Day 2',
      description: '',
      createdAt: '2024-07-15T23:20:01.290Z',
      updatedAt: '2024-07-15T23:20:01.290Z',
      events: [],
      id: '6695aebd76dcb559c2f56d18',
    },
    {
      date: '2024-06-03T00:00:00.000Z',
      name: 'Day 3',
      description: '',
      createdAt: '2024-07-15T23:20:01.290Z',
      updatedAt: '2024-07-15T23:20:01.290Z',
      events: [],
      id: '6695aebd76dcb559c2f56d19',
    },
    {
      date: '2024-06-04T00:00:00.000Z',
      name: 'Day 4',
      description: '',
      createdAt: '2024-07-15T23:20:01.290Z',
      updatedAt: '2024-07-15T23:20:01.290Z',
      events: [],
      id: '6695aebd76dcb559c2f56d1a',
    },
    {
      date: '2024-06-05T00:00:00.000Z',
      name: 'Day 5',
      description: '',
      createdAt: '2024-07-15T23:20:01.290Z',
      updatedAt: '2024-07-15T23:20:01.290Z',
      events: [],
      id: '6695aebd76dcb559c2f56d1b',
    },
    {
      date: '2024-06-06T00:00:00.000Z',
      name: 'Day 6',
      description: '',
      createdAt: '2024-07-15T23:20:01.290Z',
      updatedAt: '2024-07-15T23:20:01.290Z',
      events: [],
      id: '6695aebd76dcb559c2f56d1c',
    },
    {
      date: '2024-06-07T00:00:00.000Z',
      name: 'Day 7',
      description: '',
      createdAt: '2024-07-15T23:20:01.290Z',
      updatedAt: '2024-07-15T23:20:01.290Z',
      events: [],
      id: '6695aebd76dcb559c2f56d1d',
    },
    {
      date: '2024-06-08T00:00:00.000Z',
      name: 'Day 8',
      description: '',
      createdAt: '2024-07-15T23:20:01.290Z',
      updatedAt: '2024-07-15T23:20:01.290Z',
      events: [],
      id: '6695aebd76dcb559c2f56d1e',
    },
    {
      date: '2024-06-09T00:00:00.000Z',
      name: 'Day 9',
      description: '',
      createdAt: '2024-07-15T23:20:01.290Z',
      updatedAt: '2024-07-15T23:20:01.290Z',
      events: [],
      id: '6695aebd76dcb559c2f56d1f',
    },
    {
      date: '2024-06-10T00:00:00.000Z',
      name: 'Day 10',
      description: '',
      createdAt: '2024-07-15T23:20:01.290Z',
      updatedAt: '2024-07-15T23:20:01.290Z',
      events: [],
      id: '6695aebd76dcb559c2f56d20',
    },
  ],
  categories: [CategoriesEnum.ENTERTAINMENT],
  expenses: [],
  id: '6695aebd76dcb559c2f56d16',
};
