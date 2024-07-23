import { ReqWithUser } from '../auth/types/token-payload.type';

export const getPayload = (req: ReqWithUser) => {
  return req.user;
};
