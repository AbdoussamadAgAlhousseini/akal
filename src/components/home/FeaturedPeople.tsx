import {Link} from '@/i18n/navigation';
import type {People, Taxonomies} from '@/lib/types';
import {localize} from '@/lib/localize';
import {peopleTags} from '@/lib/tags';

/** Featured people block on the home page (prototype `.featured`). */
export default function FeaturedPeople({
  person,
  taxonomies,
  locale,
  label,
  readSheet
}: {
  person: People;
  taxonomies: Taxonomies;
  locale: string;
  label: string;
  readSheet: string;
}) {
  const tags = peopleTags(person, taxonomies, locale);

  return (
    <div className="mt-[42px] grid overflow-hidden rounded-md border border-ligne bg-white lg:[grid-template-columns:330px_1fr]">
      <div className="flex flex-col justify-center bg-indigo p-8 text-white">
        <div className="mb-2.5 text-[11px] uppercase tracking-[0.2em] text-[#B9C0DE]">
          {label}
        </div>
        <div className="font-serif text-[36px] tracking-[0.14em] text-or">
          {person.endonym}
        </div>
        <h2 className="mt-1.5 font-serif text-[25px] font-semibold">
          {person.name}
        </h2>
        <div className="mt-2 text-[13px] text-[#C9CEE6]">
          {localize(person.countries, locale)}
        </div>
      </div>
      <div className="px-9 py-8">
        <div className="flex flex-wrap gap-[7px]">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`rounded-full px-2.5 py-[3px] text-[11px] font-semibold ${tag.cls}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
        <p className="my-5 text-[15px] text-gris">
          {localize(person.summary, locale)}
        </p>
        <Link
          href={{pathname: '/peoples/[slug]', params: {slug: person.slug}}}
          className="inline-block rounded bg-laterite px-6 py-3 text-[14.5px] font-semibold text-white hover:bg-[#9E501B]"
        >
          {readSheet}
        </Link>
      </div>
    </div>
  );
}
