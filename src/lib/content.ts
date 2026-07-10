import 'server-only';

import {unstable_cache} from 'next/cache';
import {getSupabaseAdmin} from './supabase';

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

/**
 * Organizations, news and opportunities live in Supabase so they can be managed
 * (added/edited, requests approved) without a redeploy. Reads are cached for a
 * few minutes and shared across requests; edits appear within that window. On
 * any error (or missing env) they return [] so the site never crashes.
 */
export const getOrganizations = unstable_cache(
  async (): Promise<Organization[]> => {
    try {
      const {data, error} = await getSupabaseAdmin()
        .from('organizations')
        .select('name,category,country,mission,url,email,logo')
        .eq('status', 'approved')
        .order('sort', {ascending: true});
      return error || !data ? [] : (data as Organization[]);
    } catch {
      return [];
    }
  },
  ['organizations'],
  {revalidate: 300, tags: ['content']}
);

export const getNews = unstable_cache(
  async (): Promise<NewsItem[]> => {
    try {
      const {data, error} = await getSupabaseAdmin()
        .from('news')
        .select('day,month,source,title,body')
        .eq('published', true)
        .order('sort', {ascending: true});
      return error || !data ? [] : (data as NewsItem[]);
    } catch {
      return [];
    }
  },
  ['news'],
  {revalidate: 300, tags: ['content']}
);

export const getOpportunities = unstable_cache(
  async (): Promise<Opportunity[]> => {
    try {
      const {data, error} = await getSupabaseAdmin()
        .from('opportunities')
        .select('title,body,deadline')
        .eq('published', true)
        .order('sort', {ascending: true});
      return error || !data ? [] : (data as Opportunity[]);
    } catch {
      return [];
    }
  },
  ['opportunities'],
  {revalidate: 300, tags: ['content']}
);

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
