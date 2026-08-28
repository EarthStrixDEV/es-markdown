'use client';

import { useCallback, useEffect, useState } from 'react';
import { safeSet } from '@/lib/storage';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'esmd.theme';

/**
 * Theme state lives on <html data-theme> (set pre-paint by ThemeScript).
 * The hook reads the DOM attribute on mount — never storage during render —
 * and writes storage only on a manual toggle.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === 'light' || current === 'dark') setTheme(current);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      safeSet(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
