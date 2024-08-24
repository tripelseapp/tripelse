import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEmail, IsNotEmpty } from 'class-validator';
import { BudgetsEnum } from 'trip/enums/budget.enum';
import { LogisticsEnum } from 'trip/enums/logistics.enum';
import { MoodsEnum } from 'trip/enums/mood.enum';
import { PurposesEnum } from 'trip/enums/purpose.enum';
import { TripDto } from './trip.dto';

export class CreateTripDto extends PickType(TripDto, [
  'name',
  'description',
  'expenses',
  'thumbnail',
  'moods',
  'purposes',
  'logistics',
  'budget',
] as const) {
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

  @IsArray()
  @IsNotEmpty()
  @IsEmail({}, { each: true })
  @ApiProperty({
    description: 'List of user emails that will participate in the trip.',
    type: 'array',
    default: [],
    items: {
      type: 'string',
      example: 'tripelseapp@gmail.com',
    },
  })
  readonly travelers: string[];
}

export const CreateTripExample: CreateTripDto = {
  name: 'A summer trip to the beach',
  description: 'A complete week of fun and relaxation at the beach.',
  startDate: '2024-06-01T00:00:00.000Z',
  endDate: '2024-06-10T00:00:00.000Z',
  travelers: [],
  expenses: [],
  moods: [MoodsEnum.ADVENTURE],
  purposes: [PurposesEnum.ROMANTIC],
  logistics: [LogisticsEnum.CAMPER],
  thumbnail: null,
  budget: BudgetsEnum.AFFORDABLE,
};
