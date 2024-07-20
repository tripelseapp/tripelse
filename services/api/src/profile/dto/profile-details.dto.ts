import { PickType } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';

export class ProfileDetailsDto extends PickType(ProfileDto, [
  'id',
  'bio',
  'avatar',
  'updatedAt',
] as const) {}
export type ProfileDetails = ProfileDetailsDto;

export const ExampleProfileDetailsDto: ProfileDetailsDto = {
  id: '12345678',
  bio: "I'm Albert and I love to travel around the world. I'm a software engineer and I love to code.",
  avatar: '',
  updatedAt: new Date(),
};
