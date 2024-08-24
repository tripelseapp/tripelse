import { ProfileDetailsDto } from '../dto/profile-details.dto';
import { ProfileDocument } from './../entities/profile.entity';
import { getMultipleSavedTrips } from './getSavedTrips.utils';

export const getProfileDetails = (
  profile: ProfileDocument,
): ProfileDetailsDto => {
  return {
    bio: profile.bio,
    avatar: profile.avatar,
    followers: profile.followers.map((id) => id.toString()),
    following: profile.following.map((id) => id.toString()),
    id: profile._id.toString(),
    familyName: profile.familyName,
    givenName: profile.givenName,
    savedTrips: getMultipleSavedTrips(profile.savedTrips),
  };
};
