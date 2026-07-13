import type {Locale, LocalizedOrString} from './types';

/**
 * Resolve a localized value for the active locale, falling back to English.
 * Pure and side-effect free — safe to use in both server and client components.
 */
export function localize(
  value: LocalizedOrString | null | undefined,
  locale: string
): string {
  // CMS-backed content may be null/undefined (e.g. an unfilled field or an
  // unknown taxonomy key) — never let that crash a render.
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[locale as Locale] ?? value.en ?? '';
}
