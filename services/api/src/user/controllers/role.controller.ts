import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'auth/decorators/roles.decorator';
import { RolesGuard } from 'auth/guards/roles.guard';
import { ParseObjectIdPipe } from 'utils/parse-object-id-pipe.pipe';
import { ExampleUserDetailsDto, UserDetailsDto } from '../dto/user-details.dto';
import { UserService } from '../services/user.service';
import { Role, RolesEnum } from '../types/role.types';

@Controller('role')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('User Management / Roles')
export class RolesController {
  constructor(private readonly userService: UserService) {}

  //  - Update User Role by id
  @Patch(':id/roles/add/:role')
  @ApiOperation({
    summary: 'Add a role to user',
    description:
      'Adds a role to a single user with a matching id. Only Admins can do this. You will need to login again to see the changes.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: UserDetailsDto,
    description: 'User role updated',
    example: ExampleUserDetailsDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BadRequestException,
    description: 'Bad Request',
    example: {
      message: ['Invalid ID'],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  async addRole(
    @Param('id', ParseObjectIdPipe) id: string,
    @Param('role') role: Role,
  ) {
    if (!Object.values(RolesEnum).includes(role as RolesEnum)) {
      throw new BadRequestException(
        `Invalid role: ${role}, valid roles are: ${Object.values(RolesEnum)}`,
      );
    }

    const updatedUser = await this.userService.addRole(id, role as Role);
    if (!updatedUser) {
      throw new BadRequestException('This user ID did not exist');
    }
    return updatedUser;
  }
  //  - Update User Role by id
  @Patch(':id/roles/delete/:role')
  @ApiOperation({
    summary: 'Deletes a role to user',
    description:
      'Deletes a role to a single user with a matching id. Only Admins can do this. You will need to login again to see the changes.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: UserDetailsDto,
    description: 'User role updated',
    example: ExampleUserDetailsDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BadRequestException,
    description: 'Bad Request',
    example: {
      message: ['Invalid ID'],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  async removeRole(
    @Param('id', ParseObjectIdPipe) id: string,
    @Param('role') role: Role,
  ) {
    if (!Object.values(RolesEnum).includes(role as RolesEnum)) {
      throw new BadRequestException(
        `Invalid role: ${role}, valid roles are: ${Object.values(RolesEnum)}`,
      );
    }

    const updatedUser = await this.userService.deleteRole(id, role as Role);
    if (!updatedUser) {
      throw new BadRequestException('This user ID did not exist');
    }
    return updatedUser;
  }
}
