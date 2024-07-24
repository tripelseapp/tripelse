import { Request } from 'express';
import { ProfileEntity } from 'profile/entities/profile.entity';
import { UserEntity } from 'user/entities/user.entity';
import { Role } from 'user/types/role.types';

export type TokenPayload = {
  id: string;
  username: UserEntity['username'];
  roles: Role[];
  avatar: ProfileEntity['avatar'];
};

export type ReqWithUser = Request & {
  user: TokenPayload;
};
