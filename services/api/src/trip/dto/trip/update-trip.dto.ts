import { PickType } from '@nestjs/swagger';
import { TripDto } from './trip.dto';

export class UpdateTripDto extends PickType(TripDto, [
  'name',
  'description',
  'travelers',
  'categories',
  'expenses',
  'thumbnail',
  'days',
] as const) {}
