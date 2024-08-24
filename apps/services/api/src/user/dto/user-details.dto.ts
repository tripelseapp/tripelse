import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserDetailsDto extends PickType(UserDto, [
  'id',
  'username',
  'email',
  'roles',
  'createdAt',
  'updatedAt',
  'emailVerified',
] as const) {}
export type UserDetails = UserDetailsDto;

export const ExampleUserDetailsDto: UserDetailsDto = {
  id: '60f5e7b3b7b3f3001d1f3e3d',
  username: 'testuser',
  email: 'testuser@email.com',
  roles: ['user'],
  emailVerified: null,
  createdAt: '2021-07-19T15:33:07.000Z',
  updatedAt: '2021-07-19T15:33:07.000Z',
};
