import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserInListDto extends PickType(UserDto, [
  'username',
  'id',
] as const) {}
