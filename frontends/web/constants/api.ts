export const SERVER_API_URL = "http://api-nestjs:4000";
export const CLIENT_API_URL = "http://localhost:4000";

const getApiUrl = () => {
  if (typeof window !== "undefined") {
    return CLIENT_API_URL;
  }
  return SERVER_API_URL;
};
// /api/v1
enum EntitiesEnum {
  trip = "trip",
  user = "user",
}
export type Entity = keyof typeof EntitiesEnum;

const baseResource = (entity: Entity) => (id: string) =>
  `${getApiUrl()}/${entity}/${id}`;

const baseCrud = (entity: Entity) => ({
  list: `${getApiUrl()}/${entity}`,
  create: `${getApiUrl()}/${entity}`,
  show: baseResource(entity),
  update: baseResource(entity),
  delete: baseResource(entity),
});

export const API = {
  trip: baseCrud(EntitiesEnum.trip),
  user: {
    ...baseCrud(EntitiesEnum.user),
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
