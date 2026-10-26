'use client';

import { useEffect } from 'react';

import { useUiStore } from '@/stores/ui.store';

/**
 * Rehydrates persisted Zustand stores after mount so server HTML and the first
 * client render match (stores are created with `skipHydration: true`).
 */
export function StoreHydration() {
  useEffect(() => {
    void useUiStore.persist.rehydrate();
  }, []);
  return null;
}
