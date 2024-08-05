import { IntersectionType, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { ProfileDto } from 'profile/dto/profile.dto';
import { IsString } from 'class-validator';

export class UserInListDto extends IntersectionType(
  PickType(UserDto, ['username', 'id'] as const),
  PickType(ProfileDto, ['avatar'] as const),
) {
  @IsString()
  readonly profileId: string;
}

export type UserInList = UserInListDto;
