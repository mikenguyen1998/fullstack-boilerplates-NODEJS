import type { Request, Response } from 'express';

import type { PaginationMeta } from './pagination.js';

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  message: string;
  error: { code: string; details?: unknown; stack?: string };
  requestId?: string;
}

const translate = (req: Request, key: string, params?: Record<string, unknown>): string =>
  typeof req.t === 'function' ? req.t(key, params) : key;

/** Send a standard success response. `message` may be an i18n key. */
export function success<T>(
  req: Request,
  res: Response,
  data: T,
  options: { message?: string; statusCode?: number; meta?: Record<string, unknown> } = {},
): Response<ApiSuccess<T>> {
  const body: ApiSuccess<T> = {
    success: true,
    message: translate(req, options.message ?? 'common.success'),
    data,
    ...(options.meta ? { meta: options.meta } : {}),
  };
  return res.status(options.statusCode ?? 200).json(body);
}

/** Send a standard paginated response. */
export function paginated<T>(
  req: Request,
  res: Response,
  items: T[],
  pagination: PaginationMeta,
  message?: string,
): Response<ApiSuccess<T[]>> {
  return success(req, res, items, { message, meta: { pagination } });
}
