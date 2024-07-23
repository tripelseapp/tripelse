import { ProfileDetails } from '../dto/profile-details.dto';
import { ProfileEntity } from './../entities/profile.entity';

export const getProfileDetails = (profile: ProfileEntity): ProfileDetails => {
  return {
    bio: profile.bio,
    avatar: profile.avatar,
    followers: profile.followers.map((id) => id.toString()),
    following: profile.following.map((id) => id.toString()),
  };
};
