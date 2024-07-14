import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from 'src/common/dto/pagination/page-options.dto';
import { PageDto } from 'src/common/dto/pagination/page.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInListDto } from './dto/user-list.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ExampleUserDetailsDto,
  UserDetails,
  UserDetailsDto,
} from './dto/user-details.dto';
import { UserService } from './user.service';
import { passwordStrongEnough } from 'src/utils/password-checker';
import { UserDto } from './dto/user.dto';
import { NewUserRoleDto } from './dto/new-role-dto';
import { NewUserPasswordDto } from './dto/new-password-dto';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // - Get all users

  @Get()
  @ApiOperation({
    summary: 'List all users',
    description: 'Returns an array of all users. Supports pagination',
  })
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(UserInListDto)
  async getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserInListDto>> {
    if (typeof pageOptionsDto.orderBy === 'string') {
      pageOptionsDto.orderBy = [pageOptionsDto.orderBy];
    } else if (
      pageOptionsDto.orderBy &&
      !Array.isArray(pageOptionsDto.orderBy)
    ) {
      throw new BadRequestException('orderBy must be a string or an array');
    }
    return this.userService.findAll(pageOptionsDto);
  }

  // - Get user by id

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Returns a single user with a matching id.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: UserDetailsDto,
    description: 'User found',
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
  async findOne(@Param('id') id: string): Promise<UserDetails | null> {
    // validate the id
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException(['Invalid ID']);
    }
    return await this.userService.findById(id);
  }

  // - Create user

  @Post('')
  @ApiOperation({
    summary: 'Create user',
    description: 'Creates a new user.',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    type: UserDetailsDto,
    description: 'User created',
    example: ExampleUserDetailsDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: Error,
    example: {
      message: [
        'username must be longer than or equal to 4 characters',
        'username should not be empty',
        'email must be longer than or equal to 5 characters',
      ],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const usernameExists = await this.userService.findByUsernameOrEmail(
      createUserDto.username,
    );
    if (usernameExists) {
      throw new BadRequestException('Username already exists');
    }

    const emailExists = await this.userService.findUser({
      email: createUserDto.email,
    });
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }
    // is pass strong enough?
    const { strongEnough, reason } = passwordStrongEnough(
      createUserDto.password,
    );

    if (!strongEnough && reason?.length) {
      throw new BadRequestException(reason);
    }
    return this.userService.create(createUserDto);
  }

  //  - Update user by id

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user by id',
    description: 'Updates a single user with a matching id.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: UserDetailsDto,
    description: 'User created',
    example: ExampleUserDetailsDto,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BadRequestException,
    description: 'Bad Request',
    example: {
      message: ['username must be longer than or equal to 4 characters'],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = this.userService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new BadRequestException('This user ID did not exist');
    }
    return updatedUser;
  }

  //  - Delete user by id

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user by id',
    description: 'Deletes a single user with a matching id.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: UserDetailsDto,
    description: 'User deleted successfully',
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
  async delete(@Param('id') id: UserDto['id']) {
    const deletedUser = await this.userService.remove(id);
    if (!deletedUser) {
      throw new BadRequestException('This user ID did not exist');
    }
    return deletedUser;
  }

  //  - Get user by username or email

  @Get('findByUsernameOrEmail/:userNameOrEmail')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: UserDetailsDto,
  })
  @ApiOperation({
    summary: 'Get user  by username or email',
    description: 'Returns a single user with a matching username or email.',
  })
  async checkIfUsernameExists(
    @Param('userNameOrEmail') userNameOrEmail: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findByUsernameOrEmail(userNameOrEmail);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  //  - Update User Role by id
  @Patch(':id/role')
  @ApiOperation({
    summary: 'Update user role by id',
    description: 'Updates a single user role with a matching id.',
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
  async updateRole(
    @Param('id') id: string,
    @Body() newUserRoleDto: NewUserRoleDto,
  ) {
    const role = newUserRoleDto.role;

    const updatedUser = await this.userService.updateRole(id, role);
    if (!updatedUser) {
      throw new BadRequestException('This user ID did not exist');
    }
    return updatedUser;
  }

  //  - Update an user Password by id
  @Patch(':id/password')
  @ApiOperation({
    summary: 'Update user password by id',
    description: 'Updates a single user password with a matching id.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: UserDetailsDto,
    description: 'User password updated',
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
  async updatePassword(
    @Param('id') id: string,
    @Body() body: NewUserPasswordDto,
  ) {
    const newPassword = body.password;
    const updatedUser = await this.userService.updatePassword(id, newPassword);
    if (!updatedUser) {
      throw new BadRequestException('This user ID did not exist');
    }
    return updatedUser;
  }
}
