import { ProfileDetailsDto } from '../dto/profile-details.dto';
import { ProfileDocument } from './../entities/profile.entity';
import { getMultipleSavedTrips } from './getSavedTrips.utils';

export const getProfileInList = (
  profile: ProfileDocument,
): ProfileDetailsDto => {
  return {
    id: profile._id.toString(),
    bio: profile.bio,
    avatar: profile.avatar,
    followers: profile.followers.map((id) => id.toString()),
    following: profile.following.map((id) => id.toString()),
    familyName: profile.familyName,
    givenName: profile.givenName,
    savedTrips: getMultipleSavedTrips(profile.savedTrips),
  };
};

export const getProfilesInList = (
  profiles: ProfileDocument[],
): ProfileDetailsDto[] => {
  return profiles.map(getProfileInList);
};
