// event.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CategoriesEnum } from 'common/enums/category.enum';
import { AttachmentExample } from 'common/resources/attachments/dto/attachment.dto';
import { Attachment } from 'common/resources/attachments/entity/attachment.entity';
import { Expense } from 'common/resources/expenses/entities/expense.entity';
import { Activity } from 'trip/entities/activity.entity';
import { Event } from 'trip/entities/event.entity';

export class EventDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier for a event.',
    minimum: 24,
    type: 'string',
    default: '',
  })
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  @ApiProperty({
    description:
      'A short name for the event, just to label it in a user-friendly way.',
    title: 'Name',
    maximum: 40,
    type: 'string',
    default: 'A summer event to the beach',
  })
  readonly name: string;

  //description
  @IsString()
  @MaxLength(250)
  @ApiPropertyOptional({
    description:
      'Include a description or a note about the event. This can be a brief description of the event, the purpose of the event, or the event opinion.',
    maximum: 250,
    type: 'string',
    default: 'Food was great, but the music was too loud. ',
  })
  readonly description: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The start date and time of the event.',
    type: 'string',
    default: '2024-06-01T07:30:00.000Z',
  })
  readonly date: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the event was created.',
    type: 'string',
    format: 'date-time',
  })
  readonly createdAt: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the event was last updated.',
    type: 'string',
    format: 'date-time',
  })
  readonly updatedAt: string;

  //rating is a number between 1 and 5
  @IsNumber()
  @Min(0)
  @Max(10)
  @ApiPropertyOptional({
    description: 'From 0 to 10. The rating of the event.',
    type: 'number',
    default: 5,
    minimum: 0,
    maximum: 10,
  })
  readonly rating: number;

  @IsArray()
  @IsString({ each: true })
  @IsIn(Object.values(CategoriesEnum), { each: true })
  @ApiPropertyOptional({
    description: 'The categories of the trip.',
    type: 'string',
    isArray: true,
    default: [CategoriesEnum.ENTERTAINMENT, CategoriesEnum.FOOD],
  })
  readonly categories: CategoriesEnum[];

  @IsArray()
  @ApiProperty({
    type: Expense,
    isArray: true,
    description: 'Expenses associated with the event.',
  })
  readonly expenses: Expense[];

  //attachments of the event
  @IsArray()
  @ApiPropertyOptional({
    type: Attachment,
    isArray: true,
    description: 'Attachments associated with the event.',
    default: [],
  })
  readonly attachments: Attachment[];

  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: Activity,
    isArray: true,
    description: 'Activities into the event.',
    default: [],
  })
  readonly activities: Activity[];
}

export const EventExample1: Event = {
  name: 'Event 1',
  description: 'Description of the event',
  createdAt: new Date('2024-06-01T00:00:00.000Z'),
  rating: 5,
  updatedAt: new Date('2024-06-01T00:00:00.000Z'),
  activities: [],
  categories: [CategoriesEnum.FOOD, CategoriesEnum.LODGING],
  attachments: [],
  dateTime: new Date('2024-06-01T07:30:00.000Z'),
  expenses: [],
};
export const EventExample2: Event = {
  name: 'Event 2',
  description: 'Description of the event',
  createdAt: new Date('2024-06-01T00:00:00.000Z'),
  rating: 5,
  updatedAt: new Date('2024-06-01T00:00:00.000Z'),
  activities: [],
  categories: [CategoriesEnum.FOOD, CategoriesEnum.LODGING],
  attachments: [AttachmentExample],
  dateTime: new Date('2024-06-01T14:37:00.000Z'),
  expenses: [],
};
