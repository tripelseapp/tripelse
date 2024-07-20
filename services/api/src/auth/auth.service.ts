import { UserService } from '@/user/user.service';
import { comparePassword } from '@/user/utils/password-utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginRes } from './types/LoginRes.type';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UserDocument } from '@/user/entities/user.entity';
import { getUserDetails } from '@/user/utils/get-users-details';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<LoginRes> {
    // find user if a user has loginDto.usernameOrEmail as username or email and then select and get the password
    const user = await this.userService.findByUsernameOrEmail(
      loginDto.usernameOrEmail,
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
    return this.buildResponseWithToken(user);
  }
  public async register(createUserDto: CreateUserDto): Promise<LoginRes> {
    const savedUser = await this.userService.create(createUserDto);
    return this.buildResponseWithToken(savedUser);
  }
  private buildResponseWithToken(user: UserDocument): LoginRes {
    try {
      const parsedUser = getUserDetails(user);
      const token = this.jwtService.sign({
        parsedUser,
      });
      const res = { token, username: parsedUser.username, id: parsedUser.id };
      return res;
    } catch (error) {
      throw new HttpException(
        'Error creating token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
