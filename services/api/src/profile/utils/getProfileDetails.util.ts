import { ProfileDetails } from '../dto/profile-details.dto';
import { Profile } from './../entities/profile.entity';

export const getProfileDetails = (profile: Profile): ProfileDetails => {
  return {
    bio: profile.bio,
    avatar: profile.avatar,
    followers: profile.followers.map((id) => id.toString()),
    following: profile.following.map((id) => id.toString()),
    userId: profile.userId,
  };
};
