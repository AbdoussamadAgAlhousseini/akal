import 'server-only';

import {unstable_cache} from 'next/cache';
import {getSupabaseAdmin} from './supabase';

import type {
  ContentBlock,
  HomeContent,
  Instrument,
  Jurisprudence,
  Localized,
  NewsItem,
  Opportunity,
  Organization,
  People,
  Slide,
  Taxonomies
} from './types';

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

type PeopleRow = {
  slug: string;
  name: string;
  endonym: string;
  region: string;
  pastoral: boolean;
  population: string;
  lat: number;
  lng: number;
  radius: number;
  recognition: string[];
  countries: Localized;
  language: Localized;
  summary: Localized;
  sections: People['sections'] | null;
  visibility: string;
  consent_status: string | null;
  sources: string[];
  featured: boolean;
};

function rowToPeople(r: PeopleRow): People {
  return {
    slug: r.slug,
    name: r.name,
    endonym: r.endonym,
    region: r.region as People['region'],
    pastoral: r.pastoral,
    population: r.population,
    coords: [r.lat, r.lng],
    radius: r.radius,
    recognition: r.recognition as People['recognition'],
    countries: r.countries,
    language: r.language,
    summary: r.summary,
    sections: r.sections ?? undefined,
    visibility: r.visibility as People['visibility'],
    consentStatus: r.consent_status ?? undefined,
    sources: r.sources
  };
}

/**
 * Peoples live in Supabase. Only `visibility = 'public'` fact sheets are ever
 * returned — restricted/community/unpublished peoples never reach the client,
 * the HTML, the map or the search index (data sovereignty, §7.1). Cached ~5min.
 */
export const getPeoples = unstable_cache(
  async (): Promise<People[]> => {
    try {
      const {data, error} = await getSupabaseAdmin()
        .from('peoples')
        .select('*')
        .eq('visibility', 'public')
        .order('sort', {ascending: true});
      return error || !data ? [] : (data as PeopleRow[]).map(rowToPeople);
    } catch {
      return [];
    }
  },
  ['peoples'],
  {revalidate: 300, tags: ['content']}
);

/** A single public fact sheet (undefined if non-public or missing). */
export async function getPeople(slug: string): Promise<People | undefined> {
  return (await getPeoples()).find((p) => p.slug === slug);
}

/** Slugs for `generateStaticParams` — public peoples only. */
export async function getPeopleSlugs(): Promise<string[]> {
  return (await getPeoples()).map((p) => p.slug);
}

/** The "featured" public people (flag set in the admin), else the first one. */
export const getFeaturedPeople = unstable_cache(
  async (): Promise<People | undefined> => {
    try {
      const db = getSupabaseAdmin();
      let res = await db
        .from('peoples')
        .select('*')
        .eq('visibility', 'public')
        .eq('featured', true)
        .order('sort', {ascending: true})
        .limit(1);
      if (!res.data || res.data.length === 0) {
        res = await db
          .from('peoples')
          .select('*')
          .eq('visibility', 'public')
          .order('sort', {ascending: true})
          .limit(1);
      }
      return res.data?.[0] ? rowToPeople(res.data[0] as PeopleRow) : undefined;
    } catch {
      return undefined;
    }
  },
  ['featured-people'],
  {revalidate: 300, tags: ['content']}
);

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
