import type {People, Taxonomies} from './types';
import {localize} from './localize';

// Tag colour classes — reproduced from the prototype (.tag.state/.achpr/.self/.pastoral).
const TAG_CLASS: Record<string, string> = {
  state: 'bg-[#E3EBE6] text-ok',
  achpr: 'bg-[#EFE3D4] text-[#8A5A17]',
  self: 'bg-[#E4E7F2] text-indigo',
  pastoral: 'bg-laterite-soft text-laterite'
};

export type Tag = {label: string; cls: string};

/**
 * Build the ordered tag list for a people: the pastoralist tag first (when
 * applicable), then each recognition status. Pure — taxonomies are passed in so
 * this works in server and client components alike.
 */
export function peopleTags(
  person: People,
  taxonomies: Taxonomies,
  locale: string
): Tag[] {
  const tags: Tag[] = [];
  if (person.pastoral) {
    tags.push({label: localize(taxonomies.status.pastoral, locale), cls: TAG_CLASS.pastoral});
  }
  for (const status of person.recognition) {
    tags.push({label: localize(taxonomies.status[status], locale), cls: TAG_CLASS[status]});
  }
  return tags;
}
