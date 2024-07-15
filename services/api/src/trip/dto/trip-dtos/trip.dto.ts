// trip.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Expense } from 'src/common/entities/expense.entity';
import { DayDto } from '../day-dtos/day.dto';
import { categories, Category } from 'src/common/enums/category.enum';
import { Day } from 'src/trip/entities/day.entity';

export class TripDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier for a trip.',
    minimum: 24,
    type: 'string',
    default: '',
  })
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(70)
  @ApiProperty({
    description:
      'A short name for the trip, just to label it in a user-friendly way.',
    minimum: 4,
    title: 'Name',
    maximum: 70,
    type: 'string',
    default: 'A summer trip to the beach',
  })
  readonly name: string;
  @IsString()
  @MaxLength(250)
  @ApiPropertyOptional({
    description:
      'Long description of the trip, including the purpose of the trip, the places to visit, and the activities to do.',
    title: 'Name',
    maximum: 250,
    type: 'string',
    default: 'A complete week of fun and relaxation at the beach.',
  })
  readonly description: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date when the first day of the trip is planned to start.',
    type: 'string',
    default: '2024-06-01T00:00:00.000Z',
  })
  readonly startDate: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date when the last day of the trip is planned to end.',
    type: 'string',
    default: '2024-06-10T00:00:00.000Z',
  })
  readonly endDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Link to the main image of the trip.',
    type: 'string',
    default: 'https://example.com/image.jpg',
  })
  readonly thumbnail: string;

  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty({
    description: 'The list of user IDs that are part of the trip.',
    type: 'array',
    items: {
      type: 'string',
      default: ['user1', 'user2'],
    },
  })
  readonly travelers: string[];

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the trip was created.',
    type: 'string',
    format: 'date-time',
  })
  readonly createdAt: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the trip was last updated.',
    type: 'string',
    format: 'date-time',
  })
  readonly updatedAt: string;

  @IsArray()
  @ApiProperty({
    type: Expense,
    isArray: true,
    description: 'The list of expenses for the trip.',
    default: ['Flights', 'Hotel'],
  })
  readonly expenses: Expense[];

  @IsArray()
  @ApiPropertyOptional({
    type: DayDto,
    isArray: true,
    description: 'Days into the trip.',
    default: [],
  })
  readonly days: Day[];

  //CATEGORY OF THE trip
  @IsString({ each: true })
  @IsIn(categories)
  @ApiPropertyOptional({
    description: 'The categories of the trip.',
    type: 'string',
    default: ['Business', 'Family'],
  })
  readonly category: Category;
}
