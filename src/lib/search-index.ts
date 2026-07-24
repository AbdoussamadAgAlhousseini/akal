import 'server-only';

import {getTranslations} from 'next-intl/server';
import type {ContentBlock, Locale, SearchEntry} from './types';
import {localize} from './localize';
import {
  getAboutBlocks,
  getInstruments,
  getJurisprudence,
  getNews,
  getOpportunities,
  getOrganizations,
  getPastoralismBlocks,
  getPeoples,
  getResourcesBlocks
} from './content';

/**
 * Build the global search index for a locale, SERVER-SIDE, from PUBLIC content
 * only (the loaders already filter `visibility`). No restricted people can ever
 * enter the index — and therefore never reaches the client (§7.1). Covers
 * peoples (incl. their long sections), organizations, news, opportunities, and
 * the thematic pages (pastoralism, rights, resources, about).
 */
export async function buildSearchIndex(locale: string): Promise<SearchEntry[]> {
  const t = await getTranslations({locale, namespace: 'Search'});
  const tn = await getTranslations({locale, namespace: 'Nav'});
  const entries: SearchEntry[] = [];

  for (const p of await getPeoples()) {
    const countries = localize(p.countries, locale);
    const sec = p.sections?.[locale as Locale] ?? p.sections?.en;
    const sectionsText = sec ? Object.values(sec).join(' ') : '';
    entries.push({
      kind: t('people'),
      title: p.name,
      subtitle: countries,
      haystack:
        `${p.name} ${p.endonym} ${localize(p.summary, locale)} ${countries} ${sectionsText}`.toLowerCase(),
      href: {pathname: '/peoples/[slug]', params: {slug: p.slug}}
    });
  }

  for (const o of await getOrganizations()) {
    const mission = localize(o.mission, locale);
    entries.push({
      kind: t('organization'),
      title: o.name,
      subtitle: mission,
      haystack: `${o.name} ${mission}`.toLowerCase(),
      href: '/organizations'
    });
  }

  for (const n of await getNews()) {
    const title = localize(n.title, locale);
    entries.push({
      kind: t('news'),
      title,
      subtitle: localize(n.source, locale),
      haystack: `${title} ${localize(n.body, locale)}`.toLowerCase(),
      href: '/news'
    });
  }

  for (const op of await getOpportunities()) {
    const title = localize(op.title, locale);
    entries.push({
      kind: t('call'),
      title,
      subtitle: localize(op.deadline, locale),
      haystack: `${title} ${localize(op.body, locale)}`.toLowerCase(),
      href: '/news'
    });
  }

  // Thematic pages — one entry per page, searchable on all of its text.
  const kindPage = t('page');
  const blocksText = (bs: ContentBlock[]) =>
    bs.map((b) => `${localize(b.heading, locale)} ${localize(b.body, locale)}`).join(' ');
  const firstHeading = (bs: ContentBlock[]) =>
    bs[0] ? localize(bs[0].heading, locale) : '';

  const page = (
    href: SearchEntry['href'],
    title: string,
    subtitle: string,
    text: string
  ) => entries.push({kind: kindPage, title, subtitle, haystack: `${title} ${text}`.toLowerCase(), href});

  const pastoralism = getPastoralismBlocks();
  page('/pastoralism', tn('pastoralism'), firstHeading(pastoralism), blocksText(pastoralism));

  const resources = getResourcesBlocks();
  page('/resources', tn('resources'), firstHeading(resources), blocksText(resources));

  const about = getAboutBlocks();
  page('/about', tn('about'), firstHeading(about), blocksText(about));

  const instruments = getInstruments();
  const jurisprudence = getJurisprudence();
  const rightsText = [
    ...instruments.map((i) => `${localize(i.name, locale)} ${localize(i.scope, locale)}`),
    ...jurisprudence.map((j) => `${j.title} ${localize(j.body, locale)}`)
  ].join(' ');
  page(
    '/rights',
    tn('rights'),
    instruments[0] ? localize(instruments[0].name, locale) : '',
    rightsText
  );

  return entries;
}
