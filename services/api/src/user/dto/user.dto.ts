// user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role, RolesEnum, roles } from '../types/role.types';
import { Transform } from 'class-transformer';

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

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(30)
  @ApiProperty({
    description: 'The unique username for a user.',
    minimum: 4,
    type: 'string',
    default: '',
  })
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(70)
  @ApiProperty({
    description: 'The email of a user.',
    minimum: 8,
    default: '',
  })
  readonly email: string;

  @Transform(({ value }) => value.trim()) // transform is allways the first validation
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password must be no longer than 50 characters' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @ApiProperty({
    description: 'The password of a user.',
    minimum: 8,
    type: 'string',
    default: '',
  })
  readonly password: string | null;

  @IsArray()
  @IsIn(roles, { each: true })
  @ApiProperty({
    example: RolesEnum.ADMIN,
    enum: RolesEnum,
    description: 'The role of the user',
  })
  readonly roles: Role[];

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
