import { IntersectionType, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { ProfileDto } from 'profile/dto/profile.dto';

export class UserInListDto extends IntersectionType(
  PickType(UserDto, ['username', 'id'] as const),
  PickType(ProfileDto, ['avatar'] as const),
) {}

export type UserInList = UserInListDto;
