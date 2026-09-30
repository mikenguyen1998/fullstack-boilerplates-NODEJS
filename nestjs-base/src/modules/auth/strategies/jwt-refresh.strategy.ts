import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_REFRESH_STRATEGY } from '../../../common/constants';
import { AuthUser, JwtPayload } from '../../../common/interfaces';
import { jwtConfig } from '../../../config/jwt.config';
import { AuthService } from '../auth.service';

/** Xác thực refresh token (lấy từ body `refreshToken`) + đối chiếu hash trong DB */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_STRATEGY,
) {
  constructor(
    @Inject(jwtConfig.KEY)
    config: ConfigType<typeof jwtConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: config.refreshSecret,
      issuer: config.issuer,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<AuthUser> {
    const body = req.body as { refreshToken?: string } | undefined;
    const user = await this.authService.validateRefreshToken(
      payload.sub,
      body?.refreshToken ?? '',
    );
    return { id: user.id, email: user.email, role: user.role };
  }
}
