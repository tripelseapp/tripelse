// profile.dto.ts
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { CommonDto } from 'common/common.dto';

export class ProfileDto extends PickType(CommonDto, ['id'] as const) {
  //bio
  @IsString()
  @MaxLength(500)
  @ApiProperty({
    description:
      'Short biography of the profile owner, including the name, age interests...',
    title: 'Biography',
    maximum: 500,
    default:
      "I'm Albert and I love to travel around the world. I'm a software engineer and I love to code.",
  })
  readonly bio: string | null;

  //
  @IsString()
  @MaxLength(250)
  @ApiPropertyOptional({
    description: 'Avatar photo',
    title: 'Avatar',
    maximum: 250,
    type: 'string',
    default: 'image-avatar.jpg',
  })
  readonly avatar: string | null;

  @IsArray()
  @ApiPropertyOptional({
    description: 'Array of id from users that follows you',
    type: 'string[]',
    default: ['Albert', 'John', 'Doe'],
  })
  readonly followers: string[];

  @IsArray()
  @ApiPropertyOptional({
    description: 'Users id who you follow',
    type: 'string[]',
    default: ['Albert', 'John', 'Doe'],
  })
  readonly following: string[];

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the profile was created.',
    type: 'string',
    format: 'date-time',
  })
  readonly createdAt: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date and time the profile was last updated.',
    type: 'string',
    format: 'date-time',
  })
  readonly updatedAt: Date;

  @ApiProperty({
    description: 'User associated ID',
    example: '12345',
  })
  @IsString()
  userId: string; // This is the reference to the user
}
