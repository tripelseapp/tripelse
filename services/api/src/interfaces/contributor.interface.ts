import { UserDto } from '../user/dto/user.dto';

export interface Contributor {
  id: UserDto['id'];
  name: UserDto['username'];
  amount: number;
}
