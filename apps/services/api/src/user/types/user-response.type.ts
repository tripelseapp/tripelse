import { UserEntity } from '../entities/user.entity';

export type UserResponseType = Omit<UserEntity, 'password'>;
