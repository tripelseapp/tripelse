import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../types/token-payload.type';
import { UnauthorizedException } from '@nestjs/common';
import config from 'config/config';

export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const cookieName = config().jwt.refreshTokenCookie;
          if (!cookieName) {
            throw new UnauthorizedException('Refresh Token cookie not found');
          }
          return request.cookies[cookieName];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config().jwt.refreshSecret,
    });
  }

  async validate(payload: TokenPayload) {
    return {
      id: payload.id,
      username: payload.username,
      roles: payload.roles,
      avatar: payload.avatar,
    };
  }
}
