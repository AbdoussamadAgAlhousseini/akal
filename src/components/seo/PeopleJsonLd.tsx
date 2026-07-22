import {getPathname} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import type {People} from '@/lib/types';
import {localize} from '@/lib/localize';
import {SITE_NAME, SITE_URL} from '@/lib/seo';

/**
 * Per-fact-sheet JSON-LD: an Article describing the people plus a BreadcrumbList
 * (Home › Peoples › <name>). Enriches search results for each fiche.
 */
export default function PeopleJsonLd({
  person,
  locale,
  peoplesLabel
}: {
  person: People;
  locale: string;
  peoplesLabel: string;
}) {
  const url =
    SITE_URL +
    getPathname({
      href: {pathname: '/peoples/[slug]', params: {slug: person.slug}},
      locale: locale as Locale
    });
  const peoplesUrl =
    SITE_URL + getPathname({href: '/peoples', locale: locale as Locale});
  const homeUrl = SITE_URL + getPathname({href: '/', locale: locale as Locale});

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${person.name} (${person.endonym}) — ${SITE_NAME}`,
      description: localize(person.summary, locale),
      inLanguage: locale,
      url,
      about: {
        '@type': 'Thing',
        name: person.name,
        alternateName: person.endonym
      },
      isPartOf: {'@type': 'WebSite', name: SITE_NAME, url: SITE_URL},
      publisher: {'@type': 'Organization', name: SITE_NAME, url: SITE_URL}
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {'@type': 'ListItem', position: 1, name: SITE_NAME, item: homeUrl},
        {'@type': 'ListItem', position: 2, name: peoplesLabel, item: peoplesUrl},
        {'@type': 'ListItem', position: 3, name: person.name, item: url}
      ]
    }
  ];

  return (
    <script
      type="application/ld+json"
      // JSON-LD is trusted, generated content (no user input).
      dangerouslySetInnerHTML={{__html: JSON.stringify(graph)}}
    />
  );
}
