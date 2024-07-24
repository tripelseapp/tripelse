import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'common/decorators/publicRoute.decorator';
import { Request, Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { TokensRes } from './types/LoginRes.type';
import { ReqWithUser } from './types/token-payload.type';
import { constants } from 'constants/constants';

@ApiTags('Auth')
@ApiCookieAuth('Access token')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register user',
    description: 'Register a new user with username, email, and password',
  })
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const registerRes = await this.authService.register(createUserDto);
    const accessCookieName = constants.cookies.accessToken;
    if (!accessCookieName) {
      throw new NotFoundException(
        'Access token cookie name not found in environment variables, contact the administrator',
      );
    }
    const refreshCookieName = constants.cookies.refreshToken;
    if (!refreshCookieName) {
      throw new NotFoundException(
        'Refresh token cookie name not found in environment variables, contact the administrator',
      );
    }
    res.cookie(refreshCookieName, registerRes.refreshToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600000), // e.g., 1 hour
    });
    res.cookie(accessCookieName, registerRes.accessToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 2592000000), // e.g., 1 month
    });
    return res.status(HttpStatus.OK).send(registerRes);
  }

  @Get('status')
  @ApiOperation({
    summary: 'Get status',
    description: 'Get the status of the API',
  })
  getStatus(@Req() request: ReqWithUser) {
    if (request.user) {
      return { status: 'authorized', user: request.user };
    }
    return { status: 'unauthorized' };
  }

  //  Logins section
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login/credentials')
  @ApiOperation({
    summary: 'Login user',
    description: 'Get a JWT token for a user by username or email and password',
  })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const loginRes = await this.authService.login(loginDto);

    const accessCookieName = constants.cookies.accessToken;
    if (!accessCookieName) {
      throw new NotFoundException(
        'Access token cookie name not found in environment variables, contact the administrator',
      );
    }
    const refreshCookieName = constants.cookies.refreshToken;
    if (!refreshCookieName) {
      throw new NotFoundException(
        'Refresh token cookie name not found in environment variables, contact the administrator',
      );
    }
    res.cookie(refreshCookieName, loginRes.refreshToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 3600000), // e.g., 1 hour
    });
    res.cookie(accessCookieName, loginRes.accessToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 2592000000), // e.g., 1 month
    });

    return res.status(HttpStatus.OK).send(loginRes);
  }

  @Get('login/social/google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req: Request) {
    return req.user;
  }

  @Get('login/social/google/redirect')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req: ReqWithUser) {
    return this.authService.googleLogin(req);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh JWT token',
    description: 'Refresh the JWT token',
  })
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(@Body() body: RefreshTokenDto, @Req() req: ReqWithUser) {
    const refresh = body.refreshToken;
    if (!refresh) {
      throw new NotFoundException('Refresh token not found');
    }

    return this.authService.refreshToken(req.user);
  }
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const accessCookieName = constants.cookies.accessToken;
    const refreshCookieName = constants.cookies.refreshToken;

    if (!accessCookieName || !refreshCookieName) {
      throw new NotFoundException(
        'Cookie names not found in environment variables, contact the administrator',
      );
    }

    console.log('Clearing cookies:', accessCookieName, refreshCookieName);

    // Clear cookies
    res.clearCookie(accessCookieName, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.clearCookie(refreshCookieName, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Respond to the client
    res.status(HttpStatus.OK).send('Logged out successfully.');
  }
}
