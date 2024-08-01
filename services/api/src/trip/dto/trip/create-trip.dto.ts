import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { TripDto } from './trip.dto';
import { MoodsEnum } from 'trip/enums/mood.enum';
import { PurposesEnum } from 'trip/enums/purpose.enum';
import { LogisticsEnum } from 'trip/enums/logistics.enum';

export class CreateTripDto extends PickType(TripDto, [
  'name',
  'description',
  'expenses',
  'thumbnail',
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

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The moods associated with the trip.',
    type: 'array',
    enum: MoodsEnum,
    default: [],
    items: {
      type: 'string',
      example: MoodsEnum.RELAX,
    },
  })
  readonly moods: MoodsEnum[];

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The purposes of the trip.',
    type: 'array',
    enum: PurposesEnum,
    default: [],
    items: {
      type: 'string',
      example: PurposesEnum.ROMANTIC,
    },
  })
  readonly purposes: PurposesEnum[];

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'The logistics of the trip, encompassing the mode of transport and types of accommodation.',
    type: 'array',
    enum: LogisticsEnum,
    default: [],
    items: {
      type: 'string',
      example: LogisticsEnum.CAMPER,
    },
  })
  readonly logistics: LogisticsEnum[];
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
};
