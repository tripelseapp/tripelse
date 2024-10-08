// day.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { EventDto, EventExample1, EventExample2 } from '../event/event.dto';
import { Day } from 'trip/entities/day.entity';

export class DayDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier for a day.',
    minimum: 24,
    type: 'string',
    default: '',
  })
  readonly id: string;

  @IsString()
  @MaxLength(40)
  @ApiPropertyOptional({
    description:
      'A short name for the day, just to label it in a user-friendly way.',
    title: 'Name',
    maximum: 40,
    type: 'string',
    default: 'A summer day to the beach',
  })
  readonly name?: string;

  //description
  @IsString()
  @MaxLength(250)
  @ApiPropertyOptional({
    description:
      'Long description of the day, including the purpose of the day, the places to visit, and the activities to do.',
    title: 'Name',
    maximum: 250,
    type: 'string',
    default: 'A complete week of fun and relaxation at the beach.',
  })
  readonly description?: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The current day inside the trip.',
    type: 'string',
    default: '2024-06-01T00:00:00.000Z',
  })
  readonly date: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the day was created.',
    type: 'string',
    format: 'date-time',
  })
  readonly createdAt: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the day was last updated.',
    type: 'string',
    format: 'date-time',
  })
  readonly updatedAt: string;

  @IsArray()
  @ApiPropertyOptional({
    type: EventDto,
    isArray: true,
    description: 'List of events for the day.',
    default: [],
  })
  readonly events: EventDto[];
}

export const DayExample1: Day = {
  name: 'Day 1',
  description: '',
  date: new Date('2024-06-01T00:00:00.000Z'),
  createdAt: new Date('2024-06-01T00:00:00.000Z'),
  updatedAt: new Date('2024-06-01T00:00:00.000Z'),
  events: [EventExample1, EventExample2],
};
export const DayExample2: Day = {
  name: 'Day 2',
  description: 'A day to relax and enjoy the beach.',
  date: new Date('2024-06-02T00:00:00.000Z'),
  createdAt: new Date('2024-06-02T00:00:00.000Z'),
  updatedAt: new Date('2024-06-02T00:00:00.000Z'),
  events: [EventExample2],
};
