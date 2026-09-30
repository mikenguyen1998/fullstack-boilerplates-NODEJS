import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import {
  Observable,
  TimeoutError,
  catchError,
  throwError,
  timeout,
} from 'rxjs';
import { appConfig } from '../../config/app.config';

/** Huỷ request nếu vượt quá REQUEST_TIMEOUT_MS -> 408 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      timeout(this.config.requestTimeoutMs),
      catchError((err: unknown) =>
        throwError(() =>
          err instanceof TimeoutError
            ? new RequestTimeoutException('common.REQUEST_TIMEOUT')
            : err,
        ),
      ),
    );
  }
}
