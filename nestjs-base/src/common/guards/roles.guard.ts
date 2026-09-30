import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../constants';
import { Role } from '../enums';
import { AppRequest } from '../interfaces';

/**
 * Kiểm tra role dựa trên `@Roles(...)`. Đăng ký GLOBAL, chạy SAU JwtAuthGuard.
 * Route không gắn `@Roles` => cho qua.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest<AppRequest>();
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('common.FORBIDDEN');
    }
    return true;
  }
}
