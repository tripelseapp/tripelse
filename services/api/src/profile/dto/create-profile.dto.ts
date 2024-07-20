import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';
import { IsString, IsOptional } from 'class-validator';

export class CreateProfileDto extends PickType(ProfileDto, [
  'bio',
  'avatar',
  'userId',
] as const) {}

export const CreateProfileExample: CreateProfileDto = {
  bio: "I'm Albert and I love to travel around the world. I'm a software engineer and I love to code.",
  avatar: '',
  userId: '605c72ef84b9e59d7c9d74b5', // Example userId
};
