import { UserDetails } from '../dto/user-details.dto';
import { User } from '../entities/user.entity';

export const getUsersDetails = (user: User): UserDetails => {
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
