import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Response } from 'express';
import { AppRequest, getRequestId } from '../interfaces';

/** HTTP access log: method, url, status, thời gian, request id */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: AppRequest, res: Response, next: NextFunction): void {
    const start = process.hrtime.bigint();
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const ms = Number(process.hrtime.bigint() - start) / 1e6;
      const msg = `${method} ${originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms [${getRequestId(req) ?? '-'}]`;
      if (res.statusCode >= 500) this.logger.error(msg);
      else if (res.statusCode >= 400) this.logger.warn(msg);
      else this.logger.log(msg);
    });

    next();
  }
}
