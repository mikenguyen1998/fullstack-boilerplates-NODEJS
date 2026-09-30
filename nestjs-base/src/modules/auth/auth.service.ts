import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID } from 'crypto';
import { Role } from '../../common/enums';
import { AuthUser, JwtPayload } from '../../common/interfaces';
import { jwtConfig } from '../../config/jwt.config';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthResponseDto, RegisterDto, TokensDto } from './dto';

/** Hash giả để so sánh khi email không tồn tại (chống timing attack) */
const DUMMY_HASH =
  '$2b$10$xModAeytjRVojiGSl4AdcOc0Rp03Swyu3jeIjetdk9RSDngfo6OPq';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create({ ...dto, role: Role.USER });
    return this.buildAuthResponse(user);
  }

  async login(user: User): Promise<AuthResponseDto> {
    await this.usersService.markLoggedIn(user.id);
    return this.buildAuthResponse(user);
  }

  async refresh(authUser: AuthUser): Promise<TokensDto> {
    return this.issueTokens(authUser.id, authUser.email, authUser.role);
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.setRefreshTokenHash(userId, null);
  }

  me(userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  /** Dùng bởi LocalStrategy */
  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmailWithPassword(email);
    // Luôn chạy bcrypt.compare để tránh timing attack dò email
    const hash = user?.password ?? DUMMY_HASH;
    const valid = await bcrypt.compare(password, hash);
    if (!user || !valid) {
      throw new UnauthorizedException('auth.INVALID_CREDENTIALS');
    }
    if (!user.isActive) throw new UnauthorizedException('auth.USER_INACTIVE');
    return user;
  }

  /** Dùng bởi JwtRefreshStrategy: đối chiếu refresh token với hash đã lưu (rotation) */
  async validateRefreshToken(userId: string, token: string): Promise<User> {
    const user = await this.usersService.findByIdWithRefreshToken(userId);
    if (!user?.refreshTokenHash || !user.isActive) {
      throw new UnauthorizedException('auth.INVALID_REFRESH_TOKEN');
    }
    const match = await bcrypt.compare(
      this.fingerprint(token),
      user.refreshTokenHash,
    );
    if (!match) {
      // Token cũ bị dùng lại -> thu hồi toàn bộ phiên
      await this.usersService.setRefreshTokenHash(user.id, null);
      throw new UnauthorizedException('auth.INVALID_REFRESH_TOKEN');
    }
    return user;
  }

  private async buildAuthResponse(user: User): Promise<AuthResponseDto> {
    const tokens = await this.issueTokens(user.id, user.email, user.role);
    const { password: _password, refreshTokenHash: _hash, ...safe } = user;
    return { ...tokens, user: Object.assign(new User(), safe) };
  }

  private async issueTokens(
    id: string,
    email: string,
    role: Role,
  ): Promise<TokensDto> {
    const payload: JwtPayload = { sub: id, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.accessSecret,
        expiresIn: this.config.accessExpiresIn as JwtSignOptions['expiresIn'],
        issuer: this.config.issuer,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.refreshSecret,
        expiresIn: this.config.refreshExpiresIn as JwtSignOptions['expiresIn'],
        issuer: this.config.issuer,
        jwtid: randomUUID(),
      }),
    ]);

    await this.usersService.setRefreshTokenHash(
      id,
      await bcrypt.hash(this.fingerprint(refreshToken), 10),
    );

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.config.accessExpiresIn,
    };
  }

  /**
   * bcrypt chỉ dùng 72 byte đầu -> JWT dài sẽ bị cắt. Hash SHA-256 trước khi bcrypt
   * để toàn bộ token được đối chiếu.
   */
  private fingerprint(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
