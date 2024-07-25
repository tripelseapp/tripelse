import { ProfileDetails } from '../dto/profile-details.dto';
import { ProfileDocument } from './../entities/profile.entity';

export const getProfileDetails = (profile: ProfileDocument): ProfileDetails => {
  return {
    bio: profile.bio,
    avatar: profile.avatar,
    followers: profile.followers.map((id) => id.toString()),
    following: profile.following.map((id) => id.toString()),
    id: profile._id.toString(),
    familyName: profile.familyName,
    givenName: profile.givenName,
    // favoriteTrips: profile.favoriteTrips.map((id) => id.toString()),
  };
};
