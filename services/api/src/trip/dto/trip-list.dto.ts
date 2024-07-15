import { PickType } from '@nestjs/swagger';
import { TripDto } from './trip.dto';

export class TripInListDto extends PickType(TripDto, [
  'name',
  'id',
  'description',
] as const) {}
