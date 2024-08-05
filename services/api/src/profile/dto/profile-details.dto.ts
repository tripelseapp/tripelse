import { PickType } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';
import { tripDetailsExample } from 'trip/dto/trip/trip-details.dto';

export class ProfileDetailsDto extends PickType(ProfileDto, [
  'bio',
  'avatar',
  'followers',
  'following',
  'id',
  'givenName',
  'familyName',
  'savedTrips',
] as const) {}
export type ProfileDetails = ProfileDetailsDto;

export const exampleProfileDetailsDto: ProfileDetailsDto = {
  bio: "I'm Albert and I love to travel around the world. I'm a software engineer and I love to code.",
  avatar: '',
  id: '60f7b3b3b3f1f3001f9e4b3b',
  followers: ['user1', 'user2', 'user3'],
  following: ['user5', 'user4'],
  givenName: 'Albert',
  familyName: 'Einstein',
  savedTrips: [
    {
      name: 'IBIZA 2021',
      trips: [tripDetailsExample],
    },
  ],
};
