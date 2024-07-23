// trip.dto.ts
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CommonDto } from 'common/common.dto';
import { Types } from 'mongoose';
import { Day } from 'trip/entities/day.entity';
import { UserInList } from 'user/dto/user-list.dto';

export class TripDto extends PickType(CommonDto, [
  'id',
  'attachments',
  'expenses',
  'categories',
] as const) {
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

  @IsString()
  @ApiPropertyOptional({
    description: 'Link to the main image of the trip.',
    type: 'string',
    default: 'https://example.com/image.jpg',
  })
  readonly thumbnail: string | null;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the trip was created.',
    type: 'string',
    format: 'date-time',
  })
  readonly createdAt: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the trip was last updated.',
    type: 'string',
    format: 'date-time',
  })
  readonly updatedAt: Date;

  @IsArray()
  @ApiPropertyOptional({
    type: Day,
    isArray: true,
    description: 'Days into the trip.',
    default: [],
  })
  readonly days: Day[];

  @IsArray()
  @IsNotEmpty({ each: true })
  @ApiProperty({
    description: 'The list of user IDs that are part of the trip.',
    type: [Types.ObjectId],
    default: [],
  })
  readonly travelers: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user in list of the creator of the trip.',
    type: 'string',
    // default: UserInListDto,
  })
  readonly createdBy: UserInList;

  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Flag to indicate if the trip is active or not.',
    type: 'boolean',
    default: true,
  })
  readonly active: boolean;

  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Flag to indicate if the trip is public or not.',
    type: 'boolean',
    default: false,
  })
  readonly public: boolean;

  @IsBoolean()
  @ApiPropertyOptional({
    description: 'A flag that indicates if you are part of the trip.',
    type: 'boolean',
    default: false,
  })
  readonly areYouMember: boolean;
}
