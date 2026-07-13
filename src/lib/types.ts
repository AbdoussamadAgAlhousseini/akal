/**
 * Content model for AKAL (PROJET_AKAL.md §6).
 * All human-readable strings that vary by language use `Localized`.
 */

export type Locale = 'en' | 'fr' | 'es';

export type Localized = {en: string; fr: string; es: string};

/** Some source fields are a plain (language-neutral) string OR localized. */
export type LocalizedOrString = string | Localized;

export type Region = 'africa' | 'americas' | 'arctic' | 'asia';

/** Nuanced, multiple recognition statuses — never a single boolean (§7.3). */
export type Recognition = 'state' | 'achpr' | 'self';

/** CARE / data-sovereignty access level (§7.1). */
export type Visibility = 'public' | 'restricted' | 'community' | 'unpublished';

/** Long fact-sheet sections, one bundle per available language. */
export type PeopleSections = {
  identity: string;
  livelihoods: string;
  rights: string;
  threats: string;
};

export type People = {
  slug: string;
  /** Endonym in common use (shown first, before any exonym — §7.5). */
  name: string;
  /** Endonym in native script (tifinagh, syllabics…). */
  endonym: string;
  region: Region;
  pastoral: boolean;
  /** Always a range, never a single figure (§7.4). */
  population: string;
  /** Deliberately approximate (§7.2). */
  coords: [number, number];
  /** Map circle radius in metres (intentionally fuzzy). */
  radius: number;
  recognition: Recognition[];
  countries: Localized;
  language: Localized;
  /** Short description used on cards and the map popup. */
  summary: Localized;
  /** Present only for fully documented peoples; missing languages fall back to EN. */
  sections?: Partial<Record<Locale, PeopleSections>>;
  visibility: Visibility;
  /** Community consent status (FPIC / CLPE), when recorded. */
  consentStatus?: string;
  sources: string[];
};

export type OrgCategory = 'gen' | 'women' | 'youth' | 'pastoral';

export type Organization = {
  name: string;
  category: OrgCategory;
  /** Country code used by the taxonomy (e.g. "bf", "td", "int"). */
  country: string;
  mission: Localized;
  /** Official website (optional — only shown when a verified value is set). */
  url?: string;
  /** Public contact email (optional — only shown when a verified value is set). */
  email?: string;
  logo?: string;
};

export type Partner = {
  name: string;
  /** Official website (optional). */
  url?: string;
  /** Path to a logo image under /public (optional; falls back to the name). */
  logo?: string;
};

export type NewsItem = {
  day: string;
  month: Localized;
  source: LocalizedOrString;
  title: Localized;
  body: Localized;
};

export type Opportunity = {
  title: Localized;
  body: Localized;
  deadline: Localized;
  /** Link to the official announcement (optional). */
  link?: string;
};

export type Instrument = {
  name: LocalizedOrString;
  binding: boolean;
  scope: Localized;
};

export type Jurisprudence = {
  title: string;
  body: Localized;
};

/** Generic titled text block (pastoralism, resources, about sections). */
export type ContentBlock = {
  heading: Localized;
  body: Localized;
};

export type SlideScene = 'desert' | 'sahel' | 'arctic';

export type Slide = {
  scene: SlideScene;
  caption: Localized;
};

export type Taxonomy = Record<string, Localized>;

export type Taxonomies = {
  regions: Taxonomy;
  status: Taxonomy;
  categories: Taxonomy;
  countries: Taxonomy;
};

export type HomeContent = {
  stats: {indigenousPersons: string; distinctPeoples: string};
  partners: Partner[];
};

/** Destination of a search hit — a subset of the app's known pathnames. */
export type SearchHref =
  | {pathname: '/peoples/[slug]'; params: {slug: string}}
  | '/organizations'
  | '/news';

export type SearchEntry = {
  /** Localized kind label (People / Organization / News / Call). */
  kind: string;
  title: string;
  subtitle: string;
  /** Pre-lowercased searchable text for substring matching. */
  haystack: string;
  href: SearchHref;
};
