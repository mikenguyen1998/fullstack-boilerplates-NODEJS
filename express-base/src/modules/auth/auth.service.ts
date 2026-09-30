import bcrypt from 'bcryptjs';

import { env } from '@/config/env.js';
import { prisma } from '@/database/index.js';
import { publicUserSelect, type PublicUser } from '@/modules/user/user.service.js';
import { HttpError } from '@/utils/errors.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/utils/jwt.js';

import type { LoginBody, RegisterBody } from './auth.schema.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
}

function issueTokens(user: {
  id: string;
  email: string;
  role: PublicUser['role'];
  tokenVersion: number;
}): AuthTokens {
  return {
    accessToken: signAccessToken({ sub: user.id, email: user.email, role: user.role }),
    refreshToken: signRefreshToken({ sub: user.id, tokenVersion: user.tokenVersion }),
    tokenType: 'Bearer',
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  };
}

export const authService = {
  async register(input: RegisterBody): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    const exists = await prisma.user.findUnique({ where: { email: input.email } });
    if (exists) throw HttpError.conflict('auth.emailTaken');

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);
    const created = await prisma.user.create({
      data: { email: input.email, name: input.name, passwordHash },
      select: { ...publicUserSelect, tokenVersion: true },
    });

    const { tokenVersion: _tv, ...user } = created;
    return { user, tokens: issueTokens(created) };
  },

  async login(input: LoginBody): Promise<{ user: PublicUser; tokens: AuthTokens }> {
    const found = await prisma.user.findUnique({ where: { email: input.email } });
    // Same error for unknown email / wrong password to avoid user enumeration.
    const valid = found ? await bcrypt.compare(input.password, found.passwordHash) : false;
    if (!found || !valid) throw HttpError.unauthorized('auth.invalidCredentials');
    if (!found.isActive) throw HttpError.forbidden('auth.inactive');

    const updated = await prisma.user.update({
      where: { id: found.id },
      data: { lastLoginAt: new Date() },
      select: { ...publicUserSelect, tokenVersion: true },
    });

    const { tokenVersion: _tv, ...user } = updated;
    return { user, tokens: issueTokens(updated) };
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw HttpError.unauthorized('auth.invalidToken');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw HttpError.unauthorized('auth.invalidToken');
    }
    if (!user.isActive) throw HttpError.forbidden('auth.inactive');

    return issueTokens(user);
  },

  async me(userId: string): Promise<PublicUser> {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect });
    if (!user) throw HttpError.unauthorized('auth.invalidToken');
    return user;
  },
};
