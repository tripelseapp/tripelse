// a dto that extends the pagination dto with custom filters for trips and a custom response

import { IntersectionType, PickType } from '@nestjs/swagger';
import { TripDto } from './trip.dto';
import { PageOptionsDto } from '../../../common/resources/pagination';

export class GetAllTripsDto extends IntersectionType(
  PageOptionsDto,
  PickType(TripDto, ['moods', 'durations', 'purposes', 'budgets'] as const),
) {}
