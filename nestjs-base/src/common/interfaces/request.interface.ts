import type { Request } from 'express';
import { AuthUser } from './jwt-payload.interface';

/**
 * Request đã được mở rộng:
 * - `id`: request id (kiểu `ReqId` do pino-http augment sẵn) — xem RequestIdMiddleware
 * - `user`: user đã xác thực (JwtStrategy.validate)
 */
export interface AppRequest extends Request {
  user?: AuthUser;
}

export function getRequestId(req: AppRequest): string | undefined {
  const id = req.id as unknown;
  return typeof id === 'string' || typeof id === 'number'
    ? String(id)
    : undefined;
}
