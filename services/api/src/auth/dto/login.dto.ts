import { PickType } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';
import { UserEntity } from '../../user/entities/user.entity';

export class LoginDto extends PickType(UserDto, ['password'] as const) {
  usernameOrEmail: UserEntity['username'] | UserEntity['email'];
}
export type UserDetails = LoginDto;

export const ExampleLoginDto: LoginDto = {
  usernameOrEmail: 'testuser',
  password: 'password',
};
