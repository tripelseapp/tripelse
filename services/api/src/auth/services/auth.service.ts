import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UserService } from '../../user/services/user.service';
import { comparePassword } from '../../user/utils/password-utils';
import { LoginDto } from './../dto/login.dto';
import { TokensRes } from './../types/LoginRes.type';
import { UserFromProvider } from '../types/User-from-google.type';
import { ReqWithUser, TokenPayload } from '../types/token-payload.type';
import { TypedEventEmitter } from 'event-emitter/typed-event-emitter.class';
import config from 'config/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: TypedEventEmitter,
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
        'User has no password, try logging in with providers as Google',
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
    return await this.buildResponseWithToken({
      id: String(user._id),
      email: user.email,
      username: user.username,
      roles: user.roles,
      avatar: user.profile.avatar,
      profileId: String(user.profile._id),
    });
  }
  public async register(createUserDto: CreateUserDto): Promise<TokensRes> {
    const savedUser = await this.userService.create(createUserDto);

    try {
      this.eventEmitter.emit('user.welcome', {
        name: 'tripelse',
        email: createUserDto.email,
      });
    } catch (error) {
      console.log('Error sending email', error);
    }
    return await this.buildResponseWithToken({
      id: String(savedUser._id),
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
      avatar: savedUser.profile.avatar,
      profileId: String(savedUser.profile._id),
    });
  }

  async buildResponseWithToken(payload: TokenPayload): Promise<TokensRes> {
    try {
      const accessToken = await this.jwtService.signAsync(payload);
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: config().jwt.expiration,
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
      return this.buildResponseWithToken({
        id: String(user._id),
        username: user.username,
        roles: user.roles,
        email: user.email,
        avatar: user.profile.avatar,
        profileId: String(user.profile._id),
      });
    }

    // first time user is logging in (and its a google user)

    try {
      const userCreated = await this.userService.createWithProvider(details);
      return this.buildResponseWithToken({
        id: String(userCreated._id),
        username: userCreated.username,
        email: userCreated.email,
        roles: userCreated.roles,
        avatar: userCreated.profile.avatar,
        profileId: String(userCreated.profile._id),
      });
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- we are removing the password from the user object
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
  async refreshToken(tokenPayload: TokenPayload): Promise<string> {
    return await this.jwtService.signAsync(tokenPayload);
  }
  public googleLogin(req: ReqWithUser) {
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
