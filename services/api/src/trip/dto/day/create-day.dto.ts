import { PickType } from '@nestjs/swagger';
import { DayDto } from './day.dto';

export class CreateDayDto extends PickType(DayDto, [
  'name',
  'date',
  'description',
  'createdAt',
  'updatedAt',
] as const) {}
