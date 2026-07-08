import type {Metadata} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';

/**
 * Canonical site origin. Overridable via env for a future custom domain
 * (e.g. NEXT_PUBLIC_SITE_URL=https://akal.org).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://akal-eta.vercel.app'
).replace(/\/$/, '');

export const SITE_NAME = 'AKAL';

type Href = Parameters<typeof getPathname>[0]['href'];

/**
 * Build per-page SEO metadata: unique title/description, canonical URL,
 * hreflang alternates for the 3 locales (+ x-default), Open Graph and Twitter
 * card. The OG/Twitter image comes from the `opengraph-image` route.
 */
export function buildMetadata(opts: {
  locale: string;
  href: Href;
  title: string;
  description: string;
}): Metadata {
  const {locale, href, title, description} = opts;

  const canonical = SITE_URL + getPathname({href, locale: locale as Locale});

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = SITE_URL + getPathname({href, locale: l});
  }
  languages['x-default'] =
    SITE_URL + getPathname({href, locale: routing.defaultLocale});

  return {
    title,
    description,
    alternates: {canonical, languages},
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}
