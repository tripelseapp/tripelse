// activity.dto.ts

import { PickType } from '@nestjs/swagger';
import { EventDto } from '../event-dtos/event.dto';

export class ActivityDto extends PickType(EventDto, [
  'name',
  'id',
  'description',
  'createdAt',
  'updatedAt',
  'rating',
  'date',
  'expenses',
  'attachments',
  'category',
] as const) {}
