import { en } from './en';
import { th } from './th';
import type { Locale, Strings } from './types';

/* getStrings falls back to English for unknown/unloaded locales. */
const LOCALES: Partial<Record<Locale, Strings>> = { en, th };

/** Resolve a Strings bundle; unknown/unloaded locales fall back to English. */
export function getStrings(locale?: string): Strings {
  if (locale) {
    const bundle = LOCALES[locale as Locale];
    if (bundle) return bundle;
  }
  return en;
}

export type { FieldKey, FormatId, Strings, TopicId, TopicStrings } from './types';
export { FIELD_KEYS } from './types';
