import { studioEn } from './en';
import type { Locale } from '../i18n/types';
import type { StudioStrings } from './types';

/* Studio content is EN-only for now; locales without a bundle fall back to English. */
const LOCALES: Partial<Record<Locale, StudioStrings>> = { en: studioEn };

/** Resolve the Studio strings bundle; unknown or not-yet-translated locales fall back to English. */
export function getStudioStrings(locale?: string): StudioStrings {
  return (locale && LOCALES[locale as Locale]) || studioEn;
}

/** Fill `{name}` placeholders in a Studio UI template; unknown names are left as-is. */
export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}
