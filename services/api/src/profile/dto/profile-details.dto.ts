import { PickType } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';

export class ProfileDetailsDto extends PickType(ProfileDto, [
  
  'bio',
  'avatar',
  'followers',
  'following',
  'updatedAt',
  'userId',
] as const) {}
export type ProfileDetails = ProfileDetailsDto;

export const ExampleProfileDetailsDto: ProfileDetailsDto = {
  bio: "I'm Albert and I love to travel around the world. I'm a software engineer and I love to code.",
  avatar: '',
  followers: ['Albert', 'John', 'Doe'],
  following: ['Maria', 'Sandra'],
  updatedAt: new Date(),
  userId: '12345',
};
