import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants/jwt.constants';
import { TokenPayload } from '../types/token-payload.type';
import { UnauthorizedException } from '@nestjs/common';
import { constants } from 'constants/constants';

export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const cookieName = constants.cookies.refreshToken;
          if (!cookieName) {
            throw new UnauthorizedException('Refresh Token cookie not found');
          }
          return request.cookies[cookieName];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
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
