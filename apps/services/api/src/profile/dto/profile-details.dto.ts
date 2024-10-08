import { PickType } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';
import { savedTripDetailExample } from './saved-trips/saved-trips-details.dto';

export class ProfileDetailsDto extends PickType(ProfileDto, [
  'id',
  'bio',
  'avatar',
  'followers',
  'following',
  'givenName',
  'familyName',
  'savedTrips',
] as const) {}
export type ProfileDetails = ProfileDetailsDto;

export const exampleProfileDetailsDto: ProfileDetailsDto = {
  id: '60f7b3b3b3f1f3001f9e4b3b',
  bio: "I'm Albert and I love to travel around the world. I'm a software engineer and I love to code.",
  avatar: '',
  followers: ['user1', 'user2', 'user3'],
  following: ['user5', 'user4'],
  givenName: 'Albert',
  familyName: 'Einstein',
  savedTrips: [savedTripDetailExample],
};
