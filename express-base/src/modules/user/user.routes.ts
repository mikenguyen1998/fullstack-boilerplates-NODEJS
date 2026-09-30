import { Router } from 'express';

import { authenticate, authorize } from '@/middlewares/auth.js';
import { validate } from '@/middlewares/validate.js';
import { Roles } from '@/types/auth.js';
import { asyncHandler } from '@/utils/async-handler.js';

import { userController } from './user.controller.js';
import { listUsersQuerySchema, updateUserBodySchema, userIdParamsSchema } from './user.schema.js';

export const userRouter: Router = Router();

// All user-management endpoints are admin-only.
userRouter.use(authenticate, authorize(Roles.ADMIN));

userRouter.get('/', validate({ query: listUsersQuerySchema }), asyncHandler(userController.list));
userRouter.get(
  '/:id',
  validate({ params: userIdParamsSchema }),
  asyncHandler(userController.getById),
);
userRouter.patch(
  '/:id',
  validate({ params: userIdParamsSchema, body: updateUserBodySchema }),
  asyncHandler(userController.update),
);
userRouter.delete(
  '/:id',
  validate({ params: userIdParamsSchema }),
  asyncHandler(userController.remove),
);
