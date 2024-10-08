import { PickType } from '@nestjs/swagger';
import { TripDto } from './trip.dto';
import { MoodsEnum } from 'trip/enums/mood.enum';
import { DurationsEnum } from 'trip/enums/duration.enum';
import { BudgetsEnum } from 'trip/enums/budget.enum';
import { PurposesEnum } from 'trip/enums/purpose.enum';

export class TripInListDto extends PickType(TripDto, [
  'name',
  'id',
  'description',
  'thumbnail',
  'travelers',
  'moods',
  'duration',
  'purposes',
  'budget',
] as const) {}

export const tripInListExample: TripInListDto = {
  id: '60f5e7b3b7b3f3001d1f3e3d',
  name: 'A summer trip to the beach',
  duration: DurationsEnum.MEDIUM,
  description: 'A complete week of fun and relaxation at the beach.',
  thumbnail: 'https://example.com/image.jpg',
  moods: [MoodsEnum.PARTY],
  budget: BudgetsEnum.LOW,
  purposes: [PurposesEnum.ALONE, PurposesEnum.PARTY],
  travelers: [
    {
      id: '60f5e7b3b7b3f3001d1f3e3d',
      username: 'John Doe',
      profileId: '60f5e7b3b7b3f3001d1f3e3d',
      avatar: 'https://example.com/avatar.jpg',
    },
    {
      id: '60f5e7b3b7b3f3001d1f3e3d',
      username: 'Jane Doe',
      profileId: '60f5e7b3b7b3f3001d1f3e3d',
      avatar: 'https://example.com/avatar.jpg',
    },
  ],
};
