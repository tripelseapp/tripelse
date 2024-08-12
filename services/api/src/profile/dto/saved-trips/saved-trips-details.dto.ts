import { PickType } from '@nestjs/swagger';
import { SavedTripDto } from './saved-trips.dto';
import { tripInListExample } from 'trip/dto/trip/trip-list.dto';

export class SavedTripDetailsDto extends PickType(SavedTripDto, [
  'id',
  'name',
  'trips',
] as const) {}

export const savedTripDetailExample: SavedTripDetailsDto = {
  id: '60f5e7b3b7b3f3001d1f3e3d',
  name: 'Summer Vacations',
  trips: [tripInListExample],
};
