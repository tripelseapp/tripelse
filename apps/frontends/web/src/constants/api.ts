export const SERVER_API_URL = "http://api-nestjs:4000";
export const CLIENT_API_URL = "http://localhost:4000";
type BaseCrudType = (entity: Entity) => {
  list: string;
  create: string;
  show: (id: string) => string;
  update: (id: string) => string;
  delete: (id: string) => string;
};
const getApiUrl = (): string => {
  if (typeof window !== "undefined") {
    return CLIENT_API_URL;
  }
  return SERVER_API_URL;
};
// /api/v1
enum EntitiesEnum {
  Trip = "Trip",
  User = "User",
}
export type Entity = keyof typeof EntitiesEnum;

const baseResource =
  (entity: Entity) =>
  (id: string): string =>
    `${getApiUrl()}/${entity}/${id}`;

const baseCrud: BaseCrudType = (entity) => ({
  list: `${getApiUrl()}/${entity}`,
  create: `${getApiUrl()}/${entity}`,
  show: baseResource(entity),
  update: baseResource(entity),
  delete: baseResource(entity),
});

export const API = {
  trip: baseCrud(EntitiesEnum.Trip),
  user: {
    ...baseCrud(EntitiesEnum.User),
    profile: (id: string) => `${getApiUrl()}/user/${id}/profile`,
    byEmailOrUsername: (emailOrUsername: string) =>
      `${getApiUrl()}/user/by-email-or-username/${emailOrUsername}`,
    myProfile: `${getApiUrl()}/user/mine/profile`,
  },

  auth: {
    login: `${getApiUrl()}/auth/login`,
    register: `${getApiUrl()}/auth/register`,
    me: `${getApiUrl()}/auth/me`,
  },
};
