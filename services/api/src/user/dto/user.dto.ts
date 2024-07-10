// user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique identifier for a user.',
    minimum: 24,
    type: 'string',
    default: '',
  })
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique username for a user.',
    minimum: 4,
    type: 'string',
    default: '',
  })
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of a user.',
    minimum: 8,
    default: '',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of a user.',
    minimum: 8,
    type: 'string',
    default: '',
  })
  readonly password: string;

  @IsString()
  @ApiProperty({ enum: ['user', 'admin'] })
  @IsIn(['admin', 'user'])
  readonly role: 'admin' | 'user';

  @IsDateString()
  @ApiProperty({
    description: 'The date and time the user was created.',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  readonly createdAt: string;

  @IsDateString()
  @ApiProperty({
    description: 'The date and time the user was last updated.',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  readonly updatedAt: string;
}
