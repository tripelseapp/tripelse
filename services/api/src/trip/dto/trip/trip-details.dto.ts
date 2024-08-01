import { PickType } from '@nestjs/swagger';
import { TripDto } from './trip.dto';
import { DayExample1, DayExample2 } from '../day/day.dto';
import { MoodsEnum } from 'trip/enums/mood.enum';
import { PurposesEnum } from 'trip/enums/purpose.enum';
import { BudgetsEnum } from 'trip/enums/budget.enum';
import { DurationsEnum } from 'trip/enums/duration.enum';
import { LogisticsEnum } from 'trip/enums/logistics.enum';

export class TripDetailsDto extends PickType(TripDto, [
  'name',
  'id',
  'description',
  'thumbnail',
  'createdAt',
  'updatedAt',
  'expenses',
  'days',
  'moods',
  'purposes',
  'budget',
  'duration',
  'logistics',
  'travelers',
  'createdBy',
  'areYouMember',
  'public',
  'active',
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
    avatar: 'https://example.com/avatar.jpg',
  },
  days: [DayExample1, DayExample2],
  moods: [MoodsEnum.ADVENTURE],
  purposes: [PurposesEnum.ROMANTIC],
  budget: BudgetsEnum.AFFORDABLE,
  duration: DurationsEnum.SHORT,
  logistics: [LogisticsEnum.CAMPER],
  travelers: [],
  areYouMember: true,
  public: true,
  active: true,
};
