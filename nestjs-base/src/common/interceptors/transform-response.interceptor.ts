import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { SKIP_TRANSFORM_KEY } from '../constants';
import { ApiSuccessResponse, AppRequest, getRequestId } from '../interfaces';
import { isPaginated } from '../utils';

/**
 * Bọc mọi response thành công theo format:
 * { success: true, data, meta: { timestamp, requestId, ...pagination } }
 *
 * Nếu handler trả về `paginate(items, total, page, limit)` thì `data = items`
 * và thông tin phân trang được đưa vào `meta`.
 */
@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccessResponse<unknown> | T
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponse<unknown> | T> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_TRANSFORM_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip || context.getType() !== 'http') return next.handle();

    const request = context.switchToHttp().getRequest<AppRequest>();

    return next.handle().pipe(
      map((payload) => {
        if (payload instanceof StreamableFile) return payload;

        const baseMeta = {
          timestamp: new Date().toISOString(),
          requestId: getRequestId(request),
        };

        if (isPaginated(payload)) {
          return {
            success: true as const,
            data: payload.items,
            meta: { ...payload.meta, ...baseMeta },
          };
        }

        return {
          success: true as const,
          data: payload ?? null,
          meta: baseMeta,
        };
      }),
    );
  }
}
