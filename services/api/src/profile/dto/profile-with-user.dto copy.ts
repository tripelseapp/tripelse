import { PickType } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';

export class ProfileInListDto extends PickType(ProfileDto, [
  'bio',
  'avatar',
  'followers',
  'following',
] as const) {}
