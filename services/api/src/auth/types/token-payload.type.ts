import { Request } from 'express';
import { ProfileEntity } from 'profile/entities/profile.entity';
import { Role } from 'user/types/role.types';

export type TokenPayload = {
  id: string;
  username: string;
  email: string;
  roles: Role[];
  avatar: ProfileEntity['avatar'];
};

export type ReqWithUser = Request & {
  user: TokenPayload;
};
