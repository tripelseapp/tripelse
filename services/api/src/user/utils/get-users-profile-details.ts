import {
  PopulatedUser,
  PopulatedUserDocument,
} from 'user/types/populated-user.type';
import { getProfileDetails } from 'profile/utils/getProfileDetails.util';

export const getUserProfileDetails = (
  user: PopulatedUserDocument,
): PopulatedUser => {
  // If no changes have been made to the user, updatedAt will be null so we use createdAt instead

  const updatedDate =
    user.updatedAt?.toISOString() ?? user.createdAt.toISOString();

  return {
    id: String(user._id),
    username: user.username,
    email: user.email,
    roles: user.roles ?? [],
    createdAt: user.createdAt.toISOString(),
    updatedAt: updatedDate,
    profile: getProfileDetails(user.profile),
  };
};

export const getUsersDetails = (
  users: PopulatedUserDocument[],
): PopulatedUser[] => {
  return users.map((user) => getUserProfileDetails(user));
};
