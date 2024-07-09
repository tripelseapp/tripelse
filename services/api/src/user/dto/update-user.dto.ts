import { UserDto } from './user.dto';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PickType(PartialType(UserDto), [
  'username',
  'email',
  'password',
]) {}
