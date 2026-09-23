'use client';

import { useCallback, useSyncExternalStore } from 'react';
import {
  getServerSnapshot,
  getSnapshot,
  setLanguage,
  subscribe,
  type Language,
} from '@/i18n/language-store';

/**
 * Subscribes to the language store. SSR always renders 'en' (matching the
 * <html lang="en"> default); the client snapshot reads the attribute set
 * pre-paint by LangScript, so hydration settles on the stored preference.
 */
export function useLanguage() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    setLanguage(getSnapshot() === 'en' ? 'th' : 'en');
  }, []);

  return { lang, setLanguage, toggle };
}

export type { Language };
