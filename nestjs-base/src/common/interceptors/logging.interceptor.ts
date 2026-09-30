import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppRequest } from '../interfaces';

/**
 * Log thời gian xử lý ở mức handler (Controller#method).
 * (Access log mức HTTP do LoggerMiddleware đảm nhiệm.)
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Handler');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();

    const req = context.switchToHttp().getRequest<AppRequest>();
    const handler = `${context.getClass().name}#${context.getHandler().name}`;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.debug(
            `${req.method} ${req.originalUrl} -> ${handler} (${Date.now() - start}ms)`,
          ),
        error: (err: Error) =>
          this.logger.debug(
            `${req.method} ${req.originalUrl} -> ${handler} FAILED: ${err.message} (${Date.now() - start}ms)`,
          ),
      }),
    );
  }
}
