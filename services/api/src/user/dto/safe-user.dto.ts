import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SafeUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique auto ID for a user.',
    type: 'string',
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
}

export type SafeUser = SafeUserDto;
