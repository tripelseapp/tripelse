// user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class UserDto {
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
}
