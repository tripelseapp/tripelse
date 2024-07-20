import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginRes } from './types/LoginRes.type';
import { CreateUserDto } from '@/user/dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Get a JWT token for a user by username or email and password',
  })
  login(@Body() loginDto: LoginDto): Promise<LoginRes> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register user',
    description: 'Register a new user with username, email, and password',
  })
  register(@Body() createUserDto: CreateUserDto): Promise<LoginRes> {
    return this.authService.register(createUserDto);
  }
}
