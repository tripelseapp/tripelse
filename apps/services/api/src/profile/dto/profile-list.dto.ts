import { PickType } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';

export class ProfileInListDto extends PickType(ProfileDto, [
  'bio',
  'avatar',
  'givenName',
  'id',
  'followers',
  'following',
] as const) {}

export const profileInListExample: ProfileInListDto = {
  bio: "I'm Albert and I love to travel around the world. I'm a software engineer and I love to code.",
  avatar: '',
  givenName: 'Albert',
  id: '60f7b3b3b3f1f3001f9e4b3b',
  followers: ['user1', 'user2', 'user3'],
  following: ['user5', 'user4'],
};
