import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from 'auth/constants/jwt.constants';
import { TokenPayload } from 'auth/types/token-payload.type';
import { constants } from 'constants/constants';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // I have my jwt in cookies
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const cookieName = constants.cookies.accessToken;
          if (!cookieName) {
            throw new UnauthorizedException('Cookie not found');
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
    };
  }
}
