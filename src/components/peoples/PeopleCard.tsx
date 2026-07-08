import {Link} from '@/i18n/navigation';
import type {People, Taxonomies} from '@/lib/types';
import {localize} from '@/lib/localize';
import {peopleTags} from '@/lib/tags';

/**
 * People card used in the peoples grid. Endonym is shown first, in gold, above
 * the common name (§7.5). Pure/prop-driven so it renders on server or client.
 */
export default function PeopleCard({
  person,
  taxonomies,
  locale,
  readSheet
}: {
  person: People;
  taxonomies: Taxonomies;
  locale: string;
  readSheet: string;
}) {
  const tags = peopleTags(person, taxonomies, locale);

  return (
    <div className="overflow-hidden rounded-md border border-ligne bg-white transition-shadow hover:shadow-[0_8px_24px_rgba(31,42,94,0.10)]">
      <div className="bg-indigo px-5 pb-[13px] pt-[17px] text-white">
        <div className="font-serif text-[20px] tracking-[0.12em] text-or">
          {person.endonym}
        </div>
        <h3 className="mt-0.5 font-serif text-[20px] font-semibold">
          {person.name}
        </h3>
        <div className="mt-1 text-[11.5px] uppercase tracking-[0.1em] text-[#B9C0DE]">
          {localize(taxonomies.regions[person.region], locale)} ·{' '}
          {localize(person.countries, locale)}
        </div>
      </div>
      <div className="px-5 pb-5 pt-[17px]">
        <div className="mb-[13px] flex flex-wrap gap-[7px]">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`rounded-full px-2.5 py-[3px] text-[11px] font-semibold ${tag.cls}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
        <p className="mb-[13px] text-[14px] text-gris">
          {localize(person.summary, locale)}
        </p>
        <Link
          href={{pathname: '/peoples/[slug]', params: {slug: person.slug}}}
          className="text-[13.5px] font-semibold text-laterite hover:underline"
        >
          {readSheet} →
        </Link>
      </div>
    </div>
  );
}
