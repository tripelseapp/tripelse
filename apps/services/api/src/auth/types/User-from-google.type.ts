import { UserDto } from '../../user/dto/user.dto';

export type UserFromProvider = Pick<UserDto, 'username' | 'email'> & {
  avatar: string | null;
  familyName: string | null;
  givenName: string | null;
  providerName: string;
  providerId: string;
};
