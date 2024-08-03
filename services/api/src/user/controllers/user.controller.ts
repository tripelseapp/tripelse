import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReqWithUser } from 'auth/types/token-payload.type';
import { ApiPaginatedResponse } from 'common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from 'common/resources/pagination/page-options.dto';
import { PageDto } from 'common/resources/pagination/page.dto';
import configuration from 'config/configuration';
import { TypedEventEmitter } from 'event-emitter/typed-event-emitter.class';
import mongoose, { Types } from 'mongoose';
import { TemporalTokenService } from 'temporal-token/services/temporal-token.service';
import { TemporalTokenEnum } from 'temporal-token/types/temporal-token.types';
import {
  PopulatedUser,
  PopulatedUserDocument,
} from 'user/types/populated-user.type';
import { getUserProfileDetails } from 'user/utils/get-users-profile-details';
import { ParseObjectIdPipe } from 'utils/parse-object-id-pipe.pipe';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  ExampleUserDetailsDto,
  UserDetails,
  UserDetailsDto,
} from '../dto/user-details.dto';
import { UserInListDto } from '../dto/user-list.dto';
import { UserService } from '../services/user.service';

@Controller('user')
@ApiCookieAuth()
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('User Management / Users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly eventEmitter: TypedEventEmitter,
    private readonly tokenService: TemporalTokenService,
  ) {}

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

  @Get(':id/raw')
  @ApiOperation({
    summary: 'Get a complete user by id',
    description: 'Returns the complete user with a matching id.',
  })
  async findOneRaw(
    @Param('id') id: string,
  ): Promise<PopulatedUserDocument | null> {
    return await this.userService.findUser({ id });
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
    return await this.userService.findById(id);
  }

  // - Get your profile by token
  @Get('mine/profile')
  @ApiOperation({
    summary: 'Get logged-in user profile',
    description: 'Returns the profile of the logged-in user.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: UserDetailsDto,
    description: 'User profile found',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BadRequestException,
    description: 'Bad Request',
  })
  async findMineUserWithProfile(@Req() req: ReqWithUser) {
    const id = req.user.id;
    if (!id) {
      throw new BadRequestException('You are not logged in correctly');
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const userAndProfileDocument = await this.userService.findOneWithProfile(
      id,
    );
    const parsedData = getUserProfileDetails(userAndProfileDocument);

    return parsedData;
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
  async create(@Body() createUserDto: CreateUserDto): Promise<PopulatedUser> {
    const newUser = await this.userService.create(createUserDto);
    return getUserProfileDetails(newUser);
  }

  @Post('multiple')
  @ApiOperation({
    summary: 'Create multiple users',
    description: 'Creates multiple users.',
  })
  async createMultiple(
    @Body() createUserDtos: CreateUserDto[],
  ): Promise<UserDetails[]> {
    const newUser = await this.userService.createMultiple(createUserDtos);
    return newUser;
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
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
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
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    const deletedUser = await this.userService.remove(id);
    if (!deletedUser) {
      throw new BadRequestException('This user ID did not exist');
    }
    return deletedUser;
  }

  //  - Get user by username or email

  @Get('byUsernameOrEmail/:userNameOrEmail')
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
    return getUserProfileDetails(user);
  }

  //  - request a user Password email by email
  @Patch(':id/request-new-password')
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
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userService.findUser({ email });
    if (!user) throw new Error('User not found');

    const userId = user._id.toString();
    const duration = 3600000; // 1 hour
    const tokenType = TemporalTokenEnum.password_reset;

    const tokenGenerated = new mongoose.Types.ObjectId().toHexString();

    const token = await this.tokenService.create({
      type: tokenType,
      token: tokenGenerated,
      userId,
      expiresAt: new Date(Date.now() + duration),
    });

    if (!token) throw new InternalServerErrorException('Token not created');

    const resetUrl = `${
      configuration().domain
    }/auth/reset-password?token=${tokenGenerated}`;

    // Emit an event to send an email
    this.eventEmitter.emit('user.password.reset', {
      email,
      resetUrl,
      username: user.username,
    });
  }

  async updatePassword(
    @Body()
    body: {
      newPassword: string;
      token: string;
    },
    @Req() req: ReqWithUser,
  ): Promise<{
    message: string;
  }> {
    const userId = req.user.id;
    if (!userId) {
      throw new BadRequestException('You are not logged in correctly');
    }
    const newPassword = body.newPassword;
    if (!newPassword) {
      throw new BadRequestException('Password cannot be empty');
    }
    try {
      await this.userService.updatePassword(userId, newPassword);
      return {
        message: 'Password updated successfully',
      };
    } catch (error) {
      throw new BadRequestException('Password could not be updated');
    }
  }

  @Get(':id/profile')
  @ApiOperation({
    summary: 'Get user profile by id',
    description: 'Returns a single user with profile with a matching id.',
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
  async findOneWithProfile(@Param('id') id: string) {
    const userAndProfileDocument = await this.userService.findOneWithProfile(
      id,
    );

    const parsedData = getUserProfileDetails(userAndProfileDocument);

    return parsedData;
  }
}
