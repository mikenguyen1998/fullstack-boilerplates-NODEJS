import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { I18nContext } from 'nestjs-i18n';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import {
  ApiErrorDetail,
  ApiErrorResponse,
  AppRequest,
  getRequestId,
} from '../interfaces';

interface NormalizedError {
  status: number;
  message: string;
  errors?: ApiErrorDetail[];
}

/** Postgres error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html */
const PG_UNIQUE_VIOLATION = '23505';
const PG_FOREIGN_KEY_VIOLATION = '23503';

/** Map message mặc định của Nest/Passport sang i18n key */
const DEFAULT_MESSAGE_KEYS: Record<string, string> = {
  Unauthorized: 'common.UNAUTHORIZED',
  'Forbidden resource': 'common.FORBIDDEN',
  'Not Found': 'common.NOT_FOUND',
  'Internal Server Error': 'common.INTERNAL_ERROR',
};

/**
 * Filter GLOBAL bắt MỌI exception và trả về một error shape thống nhất:
 * { success:false, statusCode, error, message, errors?, path, method, timestamp, requestId }
 *
 * `message` có thể là i18n key (vd: 'auth.INVALID_CREDENTIALS') -> sẽ được dịch
 * theo ngôn ngữ của request (?lang=vi | header x-lang | Accept-Language).
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<AppRequest>();

    const { status, message, errors } = this.normalize(exception);

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ApiErrorResponse = {
      success: false,
      statusCode: status,
      error: this.statusText(status),
      message: this.translate(message),
      ...(errors?.length ? { errors } : {}),
      path: httpAdapter.getRequestUrl(request) as string,
      method: request.method,
      timestamp: new Date().toISOString(),
      requestId: getRequestId(request),
    };

    httpAdapter.reply(ctx.getResponse(), body, status);
  }

  private normalize(exception: unknown): NormalizedError {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        return { status, message: DEFAULT_MESSAGE_KEYS[res] ?? res };
      }

      const r = res as {
        message?: string | string[];
        errors?: ApiErrorDetail[];
      };
      if (Array.isArray(r.message)) {
        // ValidationPipe mặc định trả mảng message
        return {
          status,
          message: 'common.VALIDATION_FAILED',
          errors: r.message.map((m) => ({ message: m })),
        };
      }
      const message = r.message ?? exception.message;
      return {
        status,
        message: DEFAULT_MESSAGE_KEYS[message] ?? message,
        errors: r.errors,
      };
    }

    if (exception instanceof EntityNotFoundError) {
      return { status: HttpStatus.NOT_FOUND, message: 'common.NOT_FOUND' };
    }

    if (exception instanceof QueryFailedError) {
      const code = (exception.driverError as { code?: string } | undefined)
        ?.code;
      if (code === PG_UNIQUE_VIOLATION) {
        return { status: HttpStatus.CONFLICT, message: 'common.CONFLICT' };
      }
      if (code === PG_FOREIGN_KEY_VIOLATION) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'common.BAD_REQUEST',
        };
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'common.INTERNAL_ERROR',
    };
  }

  private translate(message: string): string {
    const i18n = I18nContext.current();
    if (!i18n || !/^[a-zA-Z0-9_-]+\.[A-Z0-9_.]+$/.test(message)) return message;
    return i18n.t(message, { defaultValue: message });
  }

  private statusText(status: number): string {
    const name = HttpStatus[status] as string | undefined;
    return name ?? 'UNKNOWN_ERROR';
  }
}
