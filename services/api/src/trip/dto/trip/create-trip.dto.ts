import { ApiProperty, PickType } from '@nestjs/swagger';
import { TripDto } from './trip.dto';
import { CategoriesEnum } from 'common/enums/category.enum';
import { IsArray, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateTripDto extends PickType(TripDto, [
  'name',
  'description',
  'categories',
  'expenses',
  'thumbnail',
] as const) {
  @IsArray()
  @IsNotEmpty({ each: true })
  @ApiProperty({
    description: 'The list of user IDs that are part of the trip.',
    type: [String],
    default: [],
  })
  readonly travelers: string[];
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
}

export const CreateTripExample: CreateTripDto = {
  name: 'A summer trip to the beach',
  description: 'A complete week of fun and relaxation at the beach.',
  startDate: '2024-06-01T00:00:00.000Z',
  endDate: '2024-06-10T00:00:00.000Z',
  travelers: [],
  expenses: [],
  categories: [CategoriesEnum.ENTERTAINMENT],
  thumbnail: null,
};
