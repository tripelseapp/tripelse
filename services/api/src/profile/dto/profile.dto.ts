import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { CommonDto } from 'common/common.dto';
import { SavedTripDto } from './saved-trips/saved-trips.dto';
import { SavedTripDetailsDto } from './saved-trips/saved-trips-details.dto';

export class ProfileDto extends PickType(CommonDto, ['id'] as const) {
  //bio
  @IsString()
  @MaxLength(500)
  @ApiProperty({
    description:
      'Short biography of the profile owner, including the name, age interests...',
    maximum: 500,
    default:
      "I'm Albert and I love to travel around the world. I'm a software engineer and I love to code.",
  })
  readonly bio?: string | null;

  @IsString()
  @MaxLength(100)
  @ApiProperty({
    description: 'The first name of the profile',
    default: 'Albert',
  })
  readonly givenName?: string | null;

  @IsString()
  @MaxLength(100)
  @ApiProperty({
    description: 'The family name of the profile',
    default: 'Einstein',
  })
  readonly familyName?: string | null;

  //
  @MaxLength(250)
  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Avatar photo',
    title: 'Avatar',
    maximum: 250,
    type: 'string',
    default: null,
  })
  readonly avatar?: string | null;

  @IsArray()
  @ApiProperty({
    description: 'Array of id from users that follows you',
    type: 'string[]',
    default: [],
  })
  readonly favoriteTrips: string[];

  @IsArray()
  @ApiPropertyOptional({
    description: 'Array of id from users that follows you',
    type: 'string[]',
    default: ['Albert', 'John', 'Doe'],
  })
  readonly followers?: string[];

  @IsArray()
  @ApiPropertyOptional({
    description: 'Users id who you follow',
    type: 'string[]',
    default: ['Albert', 'John', 'Doe'],
  })
  readonly following?: string[];

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the profile was created.',
    type: 'string',
    format: 'date-time',
  })
  readonly createdAt?: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the profile was last updated.',
    type: 'string',
    format: 'date-time',
  })
  readonly updatedAt?: Date;

  @IsArray()
  @ApiPropertyOptional({
    description: 'Array of folders with saved trips',
    type: [SavedTripDetailsDto],
    default: [],
  })
  readonly savedTrips: SavedTripDetailsDto[];
}
