import type {Locale, LocalizedOrString} from './types';

/**
 * Resolve a localized value for the active locale, falling back to English.
 * Pure and side-effect free — safe to use in both server and client components.
 */
export function localize(value: LocalizedOrString, locale: string): string {
  if (typeof value === 'string') return value;
  return value[locale as Locale] ?? value.en;
}
