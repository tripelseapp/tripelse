import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto extends PickType(UserDto, ['password'] as const) {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(70)
  @ApiProperty({
    description: 'The unique username or email for a user.',
    minimum: 4,
    maximum: 70,
    type: 'string',
    default: 'pepsanchis',
  })
  readonly usernameOrEmail: string;
}

export const ExampleLoginDto: LoginDto = {
  usernameOrEmail: 'testuser',
  password: 'password',
};
