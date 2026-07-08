import 'server-only';

import {getTranslations} from 'next-intl/server';
import type {SearchEntry} from './types';
import {localize} from './localize';
import {
  getNews,
  getOpportunities,
  getOrganizations,
  getPeoples
} from './content';

/**
 * Build the global search index for a locale, SERVER-SIDE, from PUBLIC content
 * only (the loaders already filter `visibility`). No restricted people can ever
 * enter the index — and therefore never reaches the client (§7.1). Covers
 * peoples, organizations, news and opportunities, matching the prototype.
 */
export async function buildSearchIndex(locale: string): Promise<SearchEntry[]> {
  const t = await getTranslations({locale, namespace: 'Search'});
  const entries: SearchEntry[] = [];

  for (const p of getPeoples()) {
    const countries = localize(p.countries, locale);
    entries.push({
      kind: t('people'),
      title: p.name,
      subtitle: countries,
      haystack:
        `${p.name} ${p.endonym} ${localize(p.summary, locale)} ${countries}`.toLowerCase(),
      href: {pathname: '/peoples/[slug]', params: {slug: p.slug}}
    });
  }

  for (const o of getOrganizations()) {
    const mission = localize(o.mission, locale);
    entries.push({
      kind: t('organization'),
      title: o.name,
      subtitle: mission,
      haystack: `${o.name} ${mission}`.toLowerCase(),
      href: '/organizations'
    });
  }

  for (const n of getNews()) {
    const title = localize(n.title, locale);
    entries.push({
      kind: t('news'),
      title,
      subtitle: localize(n.source, locale),
      haystack: `${title} ${localize(n.body, locale)}`.toLowerCase(),
      href: '/news'
    });
  }

  for (const op of getOpportunities()) {
    const title = localize(op.title, locale);
    entries.push({
      kind: t('call'),
      title,
      subtitle: localize(op.deadline, locale),
      haystack: `${title} ${localize(op.body, locale)}`.toLowerCase(),
      href: '/news'
    });
  }

  return entries;
}
