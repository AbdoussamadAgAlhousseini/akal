import type {MetadataRoute} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {getPeopleSlugs} from '@/lib/content';
import {SITE_URL} from '@/lib/seo';
import type {StaticPathname} from '@/config/sections';

const STATIC_HREFS: StaticPathname[] = [
  '/',
  '/peoples',
  '/map',
  '/pastoralism',
  '/rights',
  '/news',
  '/organizations',
  '/resources',
  '/about',
  '/contribute'
];

type Href = Parameters<typeof getPathname>[0]['href'];

/** Full sitemap: every page in every locale, with hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPeopleSlugs();
  const slugHrefs: Href[] = slugs.map((slug) => ({
    pathname: '/peoples/[slug]' as const,
    params: {slug}
  }));

  const hrefs: Href[] = [...STATIC_HREFS, ...slugHrefs];
  const now = new Date();

  return hrefs.map((href) => {
    const languages: Record<string, string> = {};
    for (const l of routing.locales) {
      languages[l] = SITE_URL + getPathname({href, locale: l});
    }
    return {
      url: SITE_URL + getPathname({href, locale: routing.defaultLocale}),
      lastModified: now,
      changeFrequency: 'weekly',
      alternates: {languages}
    };
  });
}
