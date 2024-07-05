import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { LoginDto } from './dto/Login.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'List all users',
    description: 'Returns an array of all users.',
  })
  async listUsers() {
    return this.usersService.listUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const usernameExists = await this.usersService.checkIfUsernameExists(
      createUserDto.username,
    );
    if (usernameExists) {
      throw new BadRequestException('Username already exists');
    }

    const emailExists = await this.usersService.findUserByEmail(
      createUserDto.email,
    );
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    return this.usersService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { usernameOrEmail, password } = loginDto;
    return this.usersService.loginUser(usernameOrEmail, password);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
  ) {
    const updatedUser = this.usersService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new BadRequestException('This user ID did not exist');
    }
    return updatedUser;
  }

  @Get('checkUsername/:username')
  async checkIfUsernameExists(@Param('username') username: string) {
    const doesExist = await this.usersService.checkIfUsernameExists(username);
    return {
      doesExist: doesExist,
    };
  }

  @Delete(':id')
  async deleteUserController(@Param('id') id: string) {
    const deletedUser = this.usersService.deleteUser(id);
    if (!deletedUser) {
      throw new BadRequestException('This user ID did not exist');
    }
    return deletedUser;
  }
}
