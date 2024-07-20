import { PickType } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';

export class CreateProfileDto extends PickType(ProfileDto, [
  'bio',
  'avatar',
  'createdAt',
] as const) {}

export const CreateProfileExample: CreateProfileDto = {
  bio: "I'm Albert and I love to travel around the world. I'm a software engineer and I love to code.",
  avatar: '',
  createdAt: new Date(),
};
