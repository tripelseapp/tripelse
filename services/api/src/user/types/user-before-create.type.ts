import {
  ProfileDocument,
  ProfileEntity,
} from 'profile/entities/profile.entity';
import { UserEntity } from '../../user/entities/user.entity';

export type UserBeforeCreate = {
  username: UserEntity['username'];
  email: UserEntity['email'];
  password: UserEntity['password'];
  createdAt: UserEntity['createdAt'];
  updatedAt: UserEntity['updatedAt'];
  roles: UserEntity['roles'];
  avatar?: ProfileEntity['avatar'];
  profile: ProfileDocument['_id'];
};
