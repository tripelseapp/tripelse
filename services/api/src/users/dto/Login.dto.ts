import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/schemas/User.schema';

export class LoginDto {
  @IsString({})
  @IsNotEmpty()
  @ApiProperty({
    description: 'Username or email of the user.',
    minimum: 4,
    type: 'string',
    default: null,
  })
  readonly usernameOrEmail: User['username'] | User['email'];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of a user.',
    minimum: 8,
    type: 'string',
    default: null,
  })
  readonly password: string;
}
