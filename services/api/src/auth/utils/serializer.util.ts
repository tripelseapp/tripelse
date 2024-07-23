import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import { UserEntity } from '../../user/entities/user.entity';

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super();
  }
  serializeUser(user: UserEntity, done: CallableFunction): void {
    done(null, user);
  }

  async deserializeUser(payload: any, done: CallableFunction) {
    //   search for the user by the id in the payload
    const user = await this.authService.findById(payload.sub);
    if (user) {
      return done(null, user);
    }
    done(null, null);
  }
}
