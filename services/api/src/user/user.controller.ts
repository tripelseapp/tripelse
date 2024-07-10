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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from 'src/common/dto/pagination/page-options.dto';
import { PageDto } from 'src/common/dto/pagination/page.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SafeUser, UserInListDto } from './dto/user-list.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetails, UserDetailsDto } from './dto/user-details.dto';
import { UserService } from './user.service';
import { passwordStrongEnough } from 'src/utils/password-checker';
import { UserDto } from './dto/user.dto';

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
  ): Promise<PageDto<SafeUser>> {
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
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: UserDetailsDto,
  })
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Returns a single user with a matching id.',
  })
  async findOne(@Param('id') id: string): Promise<UserDetails | null> {
    // validate the id
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid ID');
    }
    return await this.userService.findUserById(id);
  }

  // - Create user

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create user',
    description: 'Creates a new user.',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    if (
      !createUserDto.username ||
      !createUserDto.email ||
      !createUserDto.password
    ) {
      throw new BadRequestException(
        'Username, email, and password are required fields',
      );
    }

    const usernameExists = await this.userService.findByUsernameOrEmail(
      createUserDto.username,
    );
    if (usernameExists) {
      throw new BadRequestException('Username already exists');
    }

    const emailExists = await this.userService.findUserByEmail(
      createUserDto.email,
    );
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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = this.userService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new BadRequestException('This user ID did not exist');
    }
    return updatedUser;
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

  //  - Delete user by id

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user by id',
    description: 'Deletes a single user with a matching id.',
  })
  async deleteUserController(@Param('id') id: UserDto['id']) {
    const deletedUser = this.userService.remove(id);
    if (!deletedUser) {
      throw new BadRequestException('This user ID did not exist');
    }
    return deletedUser;
  }
}
