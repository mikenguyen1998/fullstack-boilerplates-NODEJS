import { Router } from 'express';

import { authRouter } from '@/modules/auth/auth.routes.js';
import { healthRouter } from '@/modules/health/health.routes.js';
import { userRouter } from '@/modules/user/user.routes.js';

/** All versioned API routes, mounted under env.API_PREFIX (default /api/v1). */
export const apiRouter: Router = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
