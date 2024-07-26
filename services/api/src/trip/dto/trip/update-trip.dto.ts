import { PickType } from '@nestjs/swagger';
import { TripDto } from './trip.dto';

export class UpdateTripDto extends PickType(TripDto, [
  'name',
  'description',
  'travelers',
  'moods',
  'purposes',
  'logistics',
  'expenses',
  'thumbnail',
  'days',
] as const) {}
