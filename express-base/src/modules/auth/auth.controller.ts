import type { Request, Response } from 'express';

import { HttpError } from '@/utils/errors.js';
import { success } from '@/utils/response.js';

import type { LoginBody, RefreshBody, RegisterBody } from './auth.schema.js';
import { authService } from './auth.service.js';

export const authController = {
  async register(req: Request<Record<string, string>, unknown, RegisterBody>, res: Response) {
    const result = await authService.register(req.body);
    return success(req, res, result, { message: 'auth.registered', statusCode: 201 });
  },

  async login(req: Request<Record<string, string>, unknown, LoginBody>, res: Response) {
    const result = await authService.login(req.body);
    return success(req, res, result, { message: 'auth.loggedIn' });
  },

  async refresh(req: Request<Record<string, string>, unknown, RefreshBody>, res: Response) {
    const tokens = await authService.refresh(req.body.refreshToken);
    return success(req, res, tokens, { message: 'auth.refreshed' });
  },

  async me(req: Request, res: Response) {
    if (!req.user) throw HttpError.unauthorized();
    return success(req, res, await authService.me(req.user.id));
  },
};
