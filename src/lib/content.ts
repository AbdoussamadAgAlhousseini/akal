import 'server-only';

import type {
  ContentBlock,
  HomeContent,
  Instrument,
  Jurisprudence,
  NewsItem,
  Opportunity,
  Organization,
  People,
  Slide,
  Taxonomies
} from './types';

import peoplesData from '../../content/peoples.json';
import organizationsData from '../../content/organizations.json';
import newsData from '../../content/news.json';
import opportunitiesData from '../../content/opportunities.json';
import instrumentsData from '../../content/instruments.json';
import jurisprudenceData from '../../content/jurisprudence.json';
import taxonomiesData from '../../content/taxonomies.json';
import pastoralismBlocksData from '../../content/pastoralism-blocks.json';
import resourcesBlocksData from '../../content/resources-blocks.json';
import aboutBlocksData from '../../content/about-blocks.json';
import slidesData from '../../content/slides.json';
import homeData from '../../content/home.json';

/**
 * Central, SERVER-ONLY content access layer.
 *
 * Every read of the `/content` files goes through here. The `server-only`
 * import guarantees this module can never be pulled into a client bundle, so
 * non-public fact sheets never reach the browser — the core Indigenous
 * data-sovereignty guarantee (PROJET_AKAL.md §7.1). `getPeoples()` /
 * `getPeople()` filter on `visibility` before returning anything, so any
 * `restricted`, `community` or `unpublished` people is invisible to the client,
 * the HTML, and the search index.
 */

const ALL_PEOPLES = peoplesData as People[];

/** Only publicly cleared fact sheets ever leave the server. */
function isPublic(p: People): boolean {
  return p.visibility === 'public';
}

export function getPeoples(): People[] {
  return ALL_PEOPLES.filter(isPublic);
}

export function getPeople(slug: string): People | undefined {
  const person = ALL_PEOPLES.find((p) => p.slug === slug);
  return person && isPublic(person) ? person : undefined;
}

/** Slugs for `generateStaticParams` — public peoples only. */
export function getPeopleSlugs(): string[] {
  return getPeoples().map((p) => p.slug);
}

export function getFeaturedPeople(): People {
  // The prototype features the first documented people (Kel Tamasheq).
  return getPeoples()[0];
}

export function getOrganizations(): Organization[] {
  return organizationsData as Organization[];
}

export function getNews(): NewsItem[] {
  return newsData as NewsItem[];
}

export function getOpportunities(): Opportunity[] {
  return opportunitiesData as Opportunity[];
}

export function getInstruments(): Instrument[] {
  return instrumentsData as Instrument[];
}

export function getJurisprudence(): Jurisprudence[] {
  return jurisprudenceData as Jurisprudence[];
}

export function getTaxonomies(): Taxonomies {
  return taxonomiesData as Taxonomies;
}

export function getPastoralismBlocks(): ContentBlock[] {
  return pastoralismBlocksData as ContentBlock[];
}

export function getResourcesBlocks(): ContentBlock[] {
  return resourcesBlocksData as ContentBlock[];
}

export function getAboutBlocks(): ContentBlock[] {
  return aboutBlocksData as ContentBlock[];
}

export function getSlides(deck: 'home' | 'pastoralism'): Slide[] {
  return (slidesData as Record<string, Slide[]>)[deck];
}

export function getHome(): HomeContent {
  return homeData as HomeContent;
}
