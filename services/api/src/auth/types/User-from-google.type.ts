import { UserDto } from '../../user/dto/user.dto';

export type UserFromGoogle = Pick<UserDto, 'id' | 'username' | 'email'> & {
  avatar: string | null;
};
