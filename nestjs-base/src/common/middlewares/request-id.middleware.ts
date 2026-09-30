import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { NextFunction, Response } from 'express';
import { REQUEST_ID_HEADER } from '../constants';
import { AppRequest, getRequestId } from '../interfaces';

/**
 * Gắn request id cho mỗi request (tái sử dụng header `x-request-id` nếu client/gateway gửi lên),
 * đồng thời trả lại header này trong response để trace.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: AppRequest, res: Response, next: NextFunction): void {
    const incoming = req.headers[REQUEST_ID_HEADER];
    const id =
      getRequestId(req) ??
      (typeof incoming === 'string' && incoming.length <= 128
        ? incoming
        : randomUUID());
    req.id = id;
    res.setHeader(REQUEST_ID_HEADER, id);
    next();
  }
}
