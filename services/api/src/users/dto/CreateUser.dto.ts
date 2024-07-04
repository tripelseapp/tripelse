import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString({})
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique username for a user.',
    minimum: 4,
    type: 'string',
    default: null,
  })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of a user.',
    minimum: 8,
    type: 'string',
    default: null,
  })
  readonly password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of a user.',
    minimum: 8,
    default: null,
  })
  readonly email: string;
}
