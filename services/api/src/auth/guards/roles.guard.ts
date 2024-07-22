import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../auth/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRoles = user.roles;
    if (!userRoles) {
      throw new UnauthorizedException('User has no roles');
    }

    const hasAcces = this.matchRoles(roles, user.roles);
    if (!hasAcces) {
      throw new UnauthorizedException();
    }
    return hasAcces;
  }

  matchRoles(roles: string[], userRoles: string[]): boolean {
    // if admin, can always, if not, check if user has the role
    if (userRoles?.includes('admin')) {
      return true;
    }

    return userRoles.some((role) => roles.includes(role));
  }
}
