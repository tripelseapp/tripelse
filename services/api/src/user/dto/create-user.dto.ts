import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
/*
DTO (UserDto): A Data Transfer Object is typically used to define the structure of data transferred over the network. It is used to shape the data that your endpoints send and receive. DTOs often exclude sensitive or unnecessary fields that are present in the entity.
*/
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The unique username for a user.',
    minimum: 4,
    type: 'string',
    default: '',
  })
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of a user.',
    minimum: 8,
    default: '',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of a user.',
    minimum: 8,
    type: 'string',
    default: '',
  })
  readonly password: string;
}
