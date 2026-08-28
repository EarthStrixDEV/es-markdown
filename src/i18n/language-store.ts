/**
 * Module-singleton language store for useSyncExternalStore. Language state
 * lives on <html lang> (set pre-paint by LangScript); the store lazily reads
 * that attribute on first client access — never during server render.
 */

import { safeSet } from '@/lib/storage';
import type { Locale } from '@/data/i18n/types';

export type Language = Locale;

const STORAGE_KEY = 'esmd.lang';

let lang: Language | null = null;

const listeners = new Set<() => void>();

function readDocumentLang(): Language {
  const value = document.documentElement.lang;
  return value === 'th' ? 'th' : 'en';
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getSnapshot(): Language {
  if (lang === null) lang = readDocumentLang();
  return lang;
}

/** Server render always assumes English — the SSR default on <html lang>. */
export function getServerSnapshot(): Language {
  return 'en';
}

export function setLanguage(next: Language): void {
  if (lang === next) return;
  lang = next;
  document.documentElement.lang = next;
  safeSet(STORAGE_KEY, next);
  listeners.forEach((cb) => cb());
}
