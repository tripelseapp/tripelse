import { UserDetails } from '../dto/user-details.dto';
import { UserDocument } from '../entities/user.entity';

export const getUserDetails = (user: UserDocument): UserDetails => {
  // If no changes have been made to the user, updatedAt will be null so we use createdAt instead

  const updatedDate =
    user.updatedAt?.toISOString() ?? user.createdAt.toISOString();

  return {
    id: String(user._id),
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: updatedDate,
  };
};

export const getUsersDetails = (users: UserDocument[]): UserDetails[] => {
  return users.map((user) => getUserDetails(user));
};
