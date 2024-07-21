import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';
/*
DTO (UserDto): A Data Transfer Object is typically used to define the structure of data transferred over the network. It is used to shape the data that your endpoints send and receive. DTOs often exclude sensitive or unnecessary fields that are present in the entity.
*/

export class NewUserRoleDto extends PickType(UserDto, ['roles'] as const) {}
