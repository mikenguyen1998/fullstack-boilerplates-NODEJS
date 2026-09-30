import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppRequest, AuthUser } from '../interfaces';

/**
 * Lấy user hiện tại từ request.
 * @example me(@CurrentUser() user: AuthUser)
 * @example me(@CurrentUser('id') userId: string)
 */
export const CurrentUser = createParamDecorator(
  (field: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AppRequest>();
    const user = request.user;
    return field ? user?.[field] : user;
  },
);
