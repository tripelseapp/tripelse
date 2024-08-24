import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenPayload } from 'auth/types/token-payload.type';
import config from 'config/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const cookieName = config().jwt.accessTokenCookie;
          if (!cookieName) {
            throw new UnauthorizedException('Cookie not found');
          }
          return request.cookies[cookieName];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config().jwt.secret,
    });
  }

  async validate(payload: TokenPayload) {
    const token: TokenPayload = payload;
    return token;
  }
}
