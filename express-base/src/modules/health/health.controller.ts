import type { Request, Response } from 'express';

import { success } from '@/utils/response.js';

import { healthService } from './health.service.js';

export const healthController = {
  liveness(req: Request, res: Response) {
    return success(req, res, healthService.liveness(), { message: 'health.ok' });
  },

  async readiness(req: Request, res: Response) {
    const result = await healthService.readiness();
    return success(req, res, result, {
      message: result.status === 'ok' ? 'health.ok' : 'common.internalError',
      statusCode: result.status === 'ok' ? 200 : 503,
    });
  },
};
