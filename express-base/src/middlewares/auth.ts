import type { RequestHandler } from 'express';

import type { Role } from '@/types/auth.js';
import { HttpError } from '@/utils/errors.js';
import { verifyAccessToken } from '@/utils/jwt.js';

/** Verifies `Authorization: Bearer <accessToken>` and sets `req.user`. */
export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.get('authorization');
  if (!header?.startsWith('Bearer ')) return next(HttpError.unauthorized());

  const token = header.slice('Bearer '.length).trim();
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    return next();
  } catch {
    return next(HttpError.unauthorized('auth.invalidToken'));
  }
};

/** Role guard. Use after `authenticate`: `router.get('/', authenticate, authorize('ADMIN'), handler)`. */
export const authorize =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(HttpError.unauthorized());
    if (roles.length > 0 && !roles.includes(req.user.role)) return next(HttpError.forbidden());
    return next();
  };
