import { PickType } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';

export class ProfileInListDto extends PickType(ProfileDto, [
  'bio',
  'avatar',
  'followers',
  'following',
] as const) {}

export const profileInListExample: ProfileInListDto = {
  bio: "I'm Albert and I love to travel around the world. I'm a software engineer and I love to code.",
  avatar: '',
  followers: ['user1', 'user2', 'user3'],
  following: ['user5', 'user4'],
};
