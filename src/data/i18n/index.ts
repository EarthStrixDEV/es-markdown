import { en } from './en';
import type { Locale, Strings } from './types';

const LOCALES: Record<Locale, Strings> = { en };

/** Resolve a Strings bundle; unknown/unloaded locales fall back to English. */
export function getStrings(locale?: string): Strings {
  if (locale && locale in LOCALES) return LOCALES[locale as Locale];
  return en;
}

export type { FieldKey, FormatId, Strings, TopicId, TopicStrings } from './types';
export { FIELD_KEYS } from './types';
