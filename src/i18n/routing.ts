import {defineRouting} from 'next-intl/routing';

/**
 * Central i18n routing configuration for AKAL.
 *
 * - Three locales, English is the default.
 * - `localePrefix: 'always'` → every URL is prefixed: /en, /fr, /es
 *   (matches the routes described in PROJET_AKAL.md §4).
 * - `pathnames` gives each of the 8 sections a localized slug per language,
 *   while the internal (folder) pathname stays in English.
 */
export const routing = defineRouting({
  locales: ['en', 'fr', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always',
  // Browser-language detection at first visit is on by default; the chosen
  // locale is then remembered via the NEXT_LOCALE cookie.
  localeDetection: true,
  pathnames: {
    '/': '/',
    '/peoples': {
      en: '/peoples',
      fr: '/peuples',
      es: '/pueblos'
    },
    '/peoples/[slug]': {
      en: '/peoples/[slug]',
      fr: '/peuples/[slug]',
      es: '/pueblos/[slug]'
    },
    '/map': {
      en: '/map',
      fr: '/carte',
      es: '/mapa'
    },
    '/pastoralism': {
      en: '/pastoralism',
      fr: '/pastoralisme',
      es: '/pastoreo'
    },
    '/rights': {
      en: '/rights',
      fr: '/droits',
      es: '/derechos'
    },
    '/news': {
      en: '/news',
      fr: '/actualites',
      es: '/noticias'
    },
    '/organizations': {
      en: '/organizations',
      fr: '/organisations',
      es: '/organizaciones'
    },
    '/resources': {
      en: '/resources',
      fr: '/ressources',
      es: '/recursos'
    },
    '/about': {
      en: '/about',
      fr: '/a-propos',
      es: '/acerca-de'
    }
  }
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
