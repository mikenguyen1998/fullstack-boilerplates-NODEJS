import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * ThrottlerGuard (global) có hỗ trợ reverse proxy / load balancer:
 * lấy IP thật từ `X-Forwarded-For` (cần `app.set('trust proxy', ...)` trong main.ts).
 * Tuỳ chỉnh limit theo route: `@Throttle({ default: { limit: 5, ttl: 60_000 } })`
 * Bỏ qua: `@SkipThrottle()`
 */
@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    const ips = req.ips as string[] | undefined;
    const ip = req.ip as string | undefined;
    return Promise.resolve(ips && ips.length > 0 ? ips[0] : (ip ?? 'unknown'));
  }
}
