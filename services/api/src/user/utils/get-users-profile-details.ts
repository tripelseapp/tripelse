import { getProfileDetails } from 'profile/utils/getProfileDetails.util';
import {
  PopulatedUser,
  PopulatedUserDocument,
} from 'user/types/populated-user.type';
import { getUserDetails } from './get-users-details';

export const getUserProfileDetails = (
  user: PopulatedUserDocument,
): PopulatedUser => {
  // If no changes have been made to the user, updatedAt will be null so we use createdAt instead

  return {
    ...getUserDetails(user as any),
    profile: getProfileDetails(user.profile),
  };
};

export const getUsersDetails = (
  users: PopulatedUserDocument[],
): PopulatedUser[] => {
  return users.map((user) => getUserProfileDetails(user));
};
