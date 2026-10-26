import { Router } from 'express';

import { validate } from '@/middlewares/validate.js';
import { asyncHandler } from '@/utils/async-handler.js';

import { userController } from './user.controller.js';
import {
  createUserBodySchema,
  listUsersQuerySchema,
  updateUserBodySchema,
  userIdParamsSchema,
} from './user.schema.js';

export const userRouter: Router = Router();

userRouter.post('/', validate({ body: createUserBodySchema }), asyncHandler(userController.create));

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
