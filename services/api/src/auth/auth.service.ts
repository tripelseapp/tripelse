import { UserDocument, UserEntity } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import { comparePassword } from '@/user/utils/password-utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userModel: Model<UserDocument>,

    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<UserEntity> {
    // find user if a user has loginDto.usernameOrEmail as username or email and then select and get the password
    const user = await this.userModel
      .findOne({
        $or: [
          { username: loginDto.usernameOrEmail },
          { email: loginDto.usernameOrEmail },
        ],
      })
      .select('password');

    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = comparePassword(loginDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Invalid credentials',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user;
  }
}