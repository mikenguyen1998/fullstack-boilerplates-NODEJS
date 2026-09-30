import type { Request, Response } from 'express';

import { paginated, success } from '@/utils/response.js';

import type { ListUsersQuery, UpdateUserBody } from './user.schema.js';
import { userService } from './user.service.js';

type IdParams = { id: string };

export const userController = {
  async list(req: Request, res: Response) {
    const { items, meta } = await userService.list(req.query as unknown as ListUsersQuery);
    return paginated(req, res, items, meta);
  },

  async getById(req: Request<IdParams>, res: Response) {
    return success(req, res, await userService.getById(req.params.id));
  },

  async update(req: Request<IdParams, unknown, UpdateUserBody>, res: Response) {
    const user = await userService.update(req.params.id, req.body);
    return success(req, res, user, { message: 'user.updated' });
  },

  async remove(req: Request<IdParams>, res: Response) {
    await userService.remove(req.params.id);
    return success(req, res, null, { message: 'user.deleted' });
  },
};
