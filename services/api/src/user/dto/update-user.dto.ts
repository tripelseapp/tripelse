import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PickType(UserDto, [
  'username',
  'email',
  'password',
  'role',
] as const) {}
