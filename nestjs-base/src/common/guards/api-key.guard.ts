import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';
import { appConfig } from '../../config/app.config';
import { API_KEY_HEADER } from '../constants';
import { AppRequest } from '../interfaces';

/**
 * (Tùy chọn) Guard xác thực bằng API key qua header `x-api-key`.
 * Danh sách key lấy từ env `API_KEYS` (phân tách bằng dấu phẩy).
 *
 * Dùng cho server-to-server / webhook. Kết hợp với `@Public()` để bỏ qua JWT:
 * @example
 *   @Public()
 *   @UseGuards(ApiKeyGuard)
 *   @Post('webhook')
 *   handleWebhook() {}
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AppRequest>();
    const provided = request.headers[API_KEY_HEADER];
    if (typeof provided !== 'string' || provided.length === 0) {
      throw new UnauthorizedException('common.INVALID_API_KEY');
    }
    const ok = this.config.apiKeys.some((key) => this.safeEqual(key, provided));
    if (!ok) throw new UnauthorizedException('common.INVALID_API_KEY');
    return true;
  }

  private safeEqual(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
  }
}
