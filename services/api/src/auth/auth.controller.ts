import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginRes } from './types/LoginRes.type';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserService } from 'user/user.service';
import { UserDetails } from 'user/dto/user-details.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Request } from 'express';
import { getUserDetails } from 'user/utils/get-users-details';

@ApiTags('auth')
@ApiCookieAuth('Access token')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register user',
    description: 'Register a new user with username, email, and password',
  })
  register(@Body() createUserDto: CreateUserDto): Promise<LoginRes> {
    return this.authService.register(createUserDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get the user profile for the currently authenticated user',
  })
  async profile(@Req() req: any): Promise<UserDetails> {
    const user = req.user;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userById = await this.userService.findUser({ id: user.sub });
    if (!userById) {
      throw new NotFoundException('User not found');
    }
    return getUserDetails(userById);
  }

  @Get('status')
  @ApiOperation({
    summary: 'Get status',
    description: 'Get the status of the API',
  })
  getStatus(@Req() request: Request) {
    if (request.user) {
      return { status: 'authorized', user: request.user };
    }
    return { status: 'unauthorized' };
  }

  //  Logins section
  @Post('login/credentials')
  @ApiOperation({
    summary: 'Login user',
    description: 'Get a JWT token for a user by username or email and password',
  })
  login(@Body() loginDto: LoginDto): Promise<LoginRes> {
    return this.authService.login(loginDto);
  }

  @Get('login/social/google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return { msg: 'google auth' };
    // redirect to google, google auths, google sends back to /auth/login/social/google/callback
  }
  @Get('login/social/google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleLoginCallback() {
    return { msg: 'ok' };
  }
}
