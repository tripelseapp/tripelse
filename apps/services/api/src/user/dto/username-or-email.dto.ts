// user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UsernameOrEmailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The username or email of the user',
    minimum: 4,
    type: 'string',
    default: '',
  })
  readonly usernameOrEmail: string;
}
