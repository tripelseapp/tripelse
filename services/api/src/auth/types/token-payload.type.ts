import { Request } from 'express';

export type TokenPayload = {
  sub: string;
  username: string;
  role: string;
};

export type ReqWithUser = Request & {
  user: TokenPayload;
};
