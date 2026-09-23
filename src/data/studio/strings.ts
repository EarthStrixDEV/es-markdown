import { studioEn } from './en';
import type { Locale } from '../i18n/types';
import type { StudioStrings } from './types';

const LOCALES: Record<Locale, StudioStrings> = { en: studioEn };

/** Resolve the Studio strings bundle; unknown locales fall back to English. */
export function getStudioStrings(locale?: string): StudioStrings {
  if (locale && locale in LOCALES) return LOCALES[locale as Locale];
  return studioEn;
}

/** Fill `{name}` placeholders in a Studio UI template; unknown names are left as-is. */
export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}
