import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDetails } from 'user/dto/user-details.dto';
import { UserService } from 'user/user.service';
import { getUserDetails } from 'user/utils/get-users-details';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginRes } from './types/LoginRes.type';
import { ReqWithUser } from './types/token-payload.type';

@ApiTags('Auth')
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get the user profile for the currently authenticated user',
  })
  async getProfile(@Request() req: ReqWithUser): Promise<UserDetails> {
    const user = req.user;
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { id } = user;
    const userById = await this.userService.findUser({ id });
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
  getStatus(@Request() request: ReqWithUser) {
    if (request.user) {
      return { status: 'authorized', user: request.user };
    }
    return { status: 'unauthorized' };
  }

  //  Logins section
  @UseGuards(LocalAuthGuard)
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
