import type {AppPathname} from '@/i18n/routing';

// Static (param-less) section routes — excludes dynamic routes like
// `/peoples/[slug]`, which must be linked with an explicit `params` object.
export type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;

/**
 * Single source of truth for the 8 tabs (+ Home) used by the header nav and
 * footer. `key` maps to the `Nav` message namespace; `href` is the internal
 * (English) pathname that next-intl localizes automatically.
 */
export const NAV_SECTIONS: {href: StaticPathname; key: string}[] = [
  {href: '/', key: 'home'},
  {href: '/peoples', key: 'peoples'},
  {href: '/map', key: 'map'},
  {href: '/pastoralism', key: 'pastoralism'},
  {href: '/rights', key: 'rights'},
  {href: '/news', key: 'news'},
  {href: '/organizations', key: 'organizations'},
  {href: '/resources', key: 'resources'},
  {href: '/about', key: 'about'}
];
