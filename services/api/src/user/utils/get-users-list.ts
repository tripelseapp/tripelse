import { UserInListDto } from '../dto/user-list.dto';
import { UserDocument } from '../entities/user.entity';

export const getUserInList = (user: UserDocument): UserInListDto => {
  return {
    id: String(user._id),
    username: user.username,
  };
};

export const getUsersInList = (users: UserDocument[]): UserInListDto[] => {
  return users.map((user) => getUserInList(user));
};
