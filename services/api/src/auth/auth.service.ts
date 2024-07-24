import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDocument } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { comparePassword } from '../user/utils/password-utils';
import { LoginDto } from './dto/login.dto';
import { TokensRes } from './types/LoginRes.type';
import { UserFromProvider } from './types/User-from-google.type';
import { ReqWithUser, TokenPayload } from './types/token-payload.type';
import { jwtConstants } from './constants/jwt.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<TokensRes> {
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

    // check if the user has a password, if not then he might be a social login user
    if (!user.password) {
      throw new HttpException(
        'User has no password, try logging in with google',
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
  public async register(createUserDto: CreateUserDto): Promise<TokensRes> {
    const savedUser = await this.userService.create(createUserDto);
    return await this.buildResponseWithToken(savedUser);
  }
  async buildResponseWithToken(user: UserDocument): Promise<TokensRes> {
    try {
      // Note: we choose a property name of sub to hold our userId value to be consistent with JWT standards.
      const payload: TokenPayload = {
        id: user._id.toString(),
        username: user.username,
        roles: user.roles,
        avatar: user.avatar,
      };
      const accessToken = await this.jwtService.signAsync(payload);
      const refreshToken = this.jwtService.sign(payload, {
        // secret: jwtConstants.refreshSecret,
        expiresIn: jwtConstants.refreshExpire,
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException(
        'Error creating token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateGoogleUser(details: UserFromProvider) {
    const user = await this.userService.findUser({
      email: details.email,
    });

    if (user) {
      console.log('User found with google details', details);
      return this.buildResponseWithToken(user);
    }

    // first time user is logging in (and its a google user)

    try {
      console.log('Creating new user with google details', details);
      const userCreated = await this.userService.createWithProvider(details);
      console.log('User created with google details');
      return this.buildResponseWithToken(userCreated);
    } catch (error) {
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string) {
    return this.userService.findById(id);
  }

  async validateUser(usernameOrEmail: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsernameOrEmail(usernameOrEmail);
    // check if user has not password, then he might be a social login user
    if (!user || !user.password) {
      return null;
    }

    if (user && (await comparePassword(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async refreshToken(tokenPayload: TokenPayload) {
    const new_access_token = await this.jwtService.signAsync(tokenPayload);
    return {
      access_token: new_access_token,
    };
  }
  public googleLogin(req: ReqWithUser) {
    console.log('req.user', req.user);
    if (!req.user) {
      return 'No user from google';
    }

    return req.user;
  }

  descerializeToken(token: string): TokenPayload {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new HttpException(
        'Error descerializing token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
