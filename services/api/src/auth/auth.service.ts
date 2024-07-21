import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDocument } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { comparePassword } from '../user/utils/password-utils';
import { LoginDto } from './dto/login.dto';
import { LoginRes } from './types/LoginRes.type';
import { UserFromGoogle } from './types/User-from-google.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<LoginRes> {
    // validate that we have the needed data
    if (!loginDto.usernameOrEmail || !loginDto.password) {
      throw new HttpException(
        'Username or email and password are required',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    // find user if a user has loginDto.usernameOrEmail as username or email and then select and get the password
    const user = await this.userService.findByUsernameOrEmail(
      loginDto.usernameOrEmail.toLowerCase(),
    );

    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await comparePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Invalid credentials',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.buildResponseWithToken(user);
  }
  public async register(createUserDto: CreateUserDto): Promise<LoginRes> {
    const savedUser = await this.userService.create(createUserDto);
    return await this.buildResponseWithToken(savedUser);
  }
  private async buildResponseWithToken(user: UserDocument): Promise<LoginRes> {
    try {
      // Note: we choose a property name of sub to hold our userId value to be consistent with JWT standards.
      const payload = {
        sub: user._id,
        username: user.username,
        role: user.role,
      };
      const access_token = await this.jwtService.signAsync(payload);

      return {
        access_token,
      };
    } catch (error) {
      throw new HttpException(
        'Error creating token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateUser(details: UserFromGoogle) {
    const user = await this.userService.findUser({
      email: details.email,
    });

    if (user) return this.buildResponseWithToken(user);

    // first time user is logging in (and its a google user)

    const newUser = await this.userService.create({
      email: details.email,
      username: details.username,
      password: null,
      avatar: details.avatar,
    });

    return this.register(newUser);
  }

  async findById(id: string) {
    return this.userService.findById(id);
  }
}
