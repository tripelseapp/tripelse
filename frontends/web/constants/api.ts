export const API_URL = "http://api-nestjs:4000";
// /api/v1
enum EntitiesEnum {
  trip = "trip",
  user = "user",
}
export type Entity = keyof typeof EntitiesEnum;

const baseResource = (entity: Entity) => (id: string) =>
  `${API_URL}/${entity}/${id}`;

const baseCrud = (entity: Entity) => ({
  list: `${API_URL}/${entity}`,
  create: `${API_URL}/${entity}`,
  show: baseResource(entity),
  update: baseResource(entity),
  delete: baseResource(entity),
});

export const API = {
  trip: baseCrud(EntitiesEnum.trip),
  user: {
    ...baseCrud(EntitiesEnum.user),
    profile: (id: string) => `${API_URL}/user/${id}/profile`,
    byEmailOrUsername: (emailOrUsername: string) =>
      `${API_URL}/user/by-email-or-username/${emailOrUsername}`,
    myProfile: `${API_URL}/user/mine/profile`,
  },

  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    me: `${API_URL}/auth/me`,
  },
};
