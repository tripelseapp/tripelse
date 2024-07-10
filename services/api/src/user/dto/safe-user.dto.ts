import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class SafeUserDto extends PickType(UserDto, ['username'] as const) {
  id: string;
}

export type SafeUser = SafeUserDto;
