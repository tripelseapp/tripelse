import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserDetailsDto extends PickType(UserDto, [
  'id',
  'username',
  'email',
  'role',
  'createdAt',
  'updatedAt',
] as const) {
  id: string;
}
export type UserDetails = UserDetailsDto;
