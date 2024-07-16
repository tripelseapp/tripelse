import { UserInListDto } from '../dto/user-list.dto';
import { User } from '../entities/user.entity';

export const getUserInList = (user: User): UserInListDto => {
  return {
    id: String(user._id),
    username: user.username,
  };
};

export const getUsersInList = (users: User[]): UserInListDto[] => {
  return users.map((user) => getUserInList(user));
};
