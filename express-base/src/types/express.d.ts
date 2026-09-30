import type { AuthUser } from './auth.js';

declare global {
  namespace Express {
    interface Request {
      /** Set by the request-id middleware. */
      id: string;
      /** Set by the `authenticate` middleware. */
      user?: AuthUser;
    }
  }
}

export {};
