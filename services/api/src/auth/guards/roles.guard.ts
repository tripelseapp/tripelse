import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../auth/decorators/roles.decorator';
import { TokenPayload } from 'auth/types/token-payload.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('Requested Roles: ', roles);
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: TokenPayload = request.user;
    const userRoles = user.roles;
    if (!userRoles) {
      throw new UnauthorizedException('User has no roles');
    }
    console.log('USER ROLES ', userRoles);

    const hasAcces = this.matchRoles(roles, user.roles);
    if (!hasAcces) {
      throw new UnauthorizedException(
        `User does not have the required roles (${roles} needed)`,
      );
    }
    return hasAcces;
  }

  matchRoles(roles: string[], userRoles: string[]): boolean {
    // if admin, can always, if not, check if user has the role

    return roles.some((role) => userRoles.includes(role));
  }
}
