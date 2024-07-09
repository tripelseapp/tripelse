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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from 'src/common/dto/pagination/page-options.dto';
import { PageDto } from 'src/common/dto/pagination/page.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SafeUser, SafeUserDto } from './dto/safe-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'List all users',
    description: 'Returns an array of all users. Supports pagination',
  })
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(SafeUserDto)
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

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Returns a single user with a matching id.',
  })
  findOne(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Post('')
  @ApiOperation({
    summary: 'Create user',
    description: 'Creates a new user.',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    if (
      !createUserDto.username ||
      !createUserDto.email ||
      !createUserDto.password
    ) {
      throw new BadRequestException(
        'Username, email, and password are required fields',
      );
    }

    const usernameExists = await this.userService.checkIfUsernameExists(
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

    return this.userService.create(createUserDto);
  }

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

  @Get('checkUsername/:username')
  async checkIfUsernameExists(@Param('username') username: string) {
    const doesExist = await this.userService.checkIfUsernameExists(username);
    return {
      doesExist: doesExist,
    };
  }

  @Delete(':id')
  async deleteUserController(@Param('id') id: string) {
    const deletedUser = this.userService.remove(id);
    if (!deletedUser) {
      throw new BadRequestException('This user ID did not exist');
    }
    return deletedUser;
  }
}
