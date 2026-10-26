import type { Request } from 'express';

export type AppRequest = Request;

export function getRequestId(req: AppRequest): string | undefined {
  const id = req.id as unknown;
  return typeof id === 'string' || typeof id === 'number'
    ? String(id)
    : undefined;
}
