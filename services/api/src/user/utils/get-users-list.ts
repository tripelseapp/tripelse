import { PopulatedUserDocument } from 'user/types/populated-user.type';
import { UserInListDto } from '../dto/user-list.dto';
import { UserDocument } from 'user/entities/user.entity';

export const getUserInList = (user: UserDocument): UserInListDto => {
  const populatedUser = user as unknown as PopulatedUserDocument;
  return {
    id: String(user._id),
    username: user.username,
    avatar: populatedUser.profile?.avatar ?? null,
  };
};

export const getUsersInList = (users: UserDocument[]): UserInListDto[] => {
  const array = users || [];
  return array.map((user) => getUserInList(user));
};
