import type { StateStorage } from 'zustand/middleware';

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

/**
 * SSR-safe storage for Zustand `persist`.
 * Node >= 25 exposes a global `localStorage` on the server too; we must never
 * touch it there (it would be shared between requests), so check for `window`.
 */
export const safeLocalStorage = (): StateStorage =>
  typeof window === 'undefined' ? noopStorage : window.localStorage;
