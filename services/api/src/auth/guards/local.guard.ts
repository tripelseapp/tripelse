import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromCookie(request);
//     if (!token) {
//       throw new UnauthorizedException();
//     }
//     try {
//       const payload: TokenPayload = await this.jwtService.verifyAsync(token, {
//         secret: jwtConstants.secret,
//       });
//       // 💡 We're assigning the payload to the request object here
//       // so that we can access it in our route handlers
//       request['user'] = payload;
//     } catch {
//       throw new UnauthorizedException();
//     }
//     return true;
//   }

//   // private extractTokenFromHeader(request: Request): string | undefined {
//   //   const [type, token] = request.headers.authorization?.split(' ') ?? [];
//   //   console.log([type, token]);
//   //   return type === TOKEN_KEY ? token : undefined;
//   // }
//   private extractTokenFromCookie(request: Request): string | undefined {
//     const cookieName = constants.cookies.accessToken;
//     if (!cookieName) {
//       return undefined;
//     }
//     const token: string = request.cookies[cookieName];
//     return token ? token : undefined;
//   }
// }
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
