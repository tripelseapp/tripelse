import { IntersectionType, PickType } from '@nestjs/swagger';
import { SavedTripDto } from './saved-trips.dto';

export class DeleteTripsToFolderDto extends IntersectionType(
  PickType(SavedTripDto, ['tripIds'] as const),
) {}
