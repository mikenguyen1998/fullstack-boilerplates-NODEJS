import { Router } from 'express';

import { authenticate } from '@/middlewares/auth.js';
import { authRateLimiter } from '@/middlewares/rate-limit.js';
import { validate } from '@/middlewares/validate.js';
import { asyncHandler } from '@/utils/async-handler.js';

import { authController } from './auth.controller.js';
import { loginBodySchema, refreshBodySchema, registerBodySchema } from './auth.schema.js';

export const authRouter: Router = Router();

authRouter.post(
  '/register',
  authRateLimiter,
  validate({ body: registerBodySchema }),
  asyncHandler(authController.register),
);
authRouter.post(
  '/login',
  authRateLimiter,
  validate({ body: loginBodySchema }),
  asyncHandler(authController.login),
);
authRouter.post(
  '/refresh',
  authRateLimiter,
  validate({ body: refreshBodySchema }),
  asyncHandler(authController.refresh),
);
authRouter.get('/me', authenticate, asyncHandler(authController.me));
