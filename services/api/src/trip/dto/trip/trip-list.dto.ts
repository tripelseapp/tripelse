import { PickType } from '@nestjs/swagger';
import { TripDto } from './trip.dto';

export class TripInListDto extends PickType(TripDto, [
  'name',
  'id',
  'description',
  'thumbnail',
] as const) {}

export const TripInListExample: TripInListDto = {
  id: '60f5e7b3b7b3f3001d1f3e3d',
  name: 'A summer trip to the beach',
  description: 'A complete week of fun and relaxation at the beach.',
  thumbnail: 'https://example.com/image.jpg',
};