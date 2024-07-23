import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import { UserEntity } from '../../user/entities/user.entity';
import { TokensRes } from 'auth/types/LoginRes.type';

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super();
  }
  serializeUser(user: UserEntity, done: CallableFunction): void {
    done(null, user);
  }

  async deserializeUser(payload: TokensRes, done: CallableFunction) {
    //   search for the user by the id in the payload
    const accesToken = payload.accessToken;
    const descerializeToken = await this.authService.descerializeToken(
      accesToken,
    );

    if (!accesToken) {
      done(null, null);
    }

    const user = await this.authService.findById(descerializeToken.id);
    if (user) {
      return done(null, user);
    }
    done(null, null);
  }
}
