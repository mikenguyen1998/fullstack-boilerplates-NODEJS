import type { RequestHandler } from 'express';

import { HttpError } from '@/utils/errors.js';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(HttpError.notFound('common.routeNotFound', { method: req.method, path: req.originalUrl }));
};
