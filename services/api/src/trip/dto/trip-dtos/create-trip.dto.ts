import { PickType } from '@nestjs/swagger';
import { TripDto } from './trip.dto';

export class CreateTripDto extends PickType(TripDto, [
  'name',
  'description',
  'startDate',
  'endDate',
  'travelers',
  'category',
  'expenses',
] as const) {}

