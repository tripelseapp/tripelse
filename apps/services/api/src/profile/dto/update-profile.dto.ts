import { PickType } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';

export class UpdateProfileDto extends PickType(ProfileDto, [
  'bio',
  'avatar',
] as const) {}
