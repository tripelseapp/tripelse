import { Request } from 'express';
import { Role } from 'user/types/role.types';

export type TokenPayload = {
  id: string;
  username: string;
  roles: Role[];
};

export type ReqWithUser = Request & {
  user: TokenPayload;
};
