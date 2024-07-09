import { PickProperties } from 'src/utils/helpers';
import { User } from '../entities/user.entity';

export type UserById = PickProperties<
  User,
  'username' | 'email' | 'role' | 'createdAt' | 'updatedAt'
> & {
  id: string;
};
