export enum RolesEnum {
  USER = 'user',
  ADMIN = 'admin',
}
export type Role = `${RolesEnum}`;
export const roles = Object.values(RolesEnum);
