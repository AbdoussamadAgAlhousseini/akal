'use client';

import {useState} from 'react';
import type {People, Taxonomies} from '@/lib/types';
import PeopleCard from './PeopleCard';

/**
 * Peoples directory with a region filter (prototype `.filterrow` + `.grid.g3`).
 * All data is passed in pre-filtered by the server (public peoples only).
 */
export default function PeoplesExplorer({
  peoples,
  taxonomies,
  locale,
  regions,
  allRegionsLabel,
  readSheet
}: {
  peoples: People[];
  taxonomies: Taxonomies;
  locale: string;
  regions: {key: string; label: string}[];
  allRegionsLabel: string;
  readSheet: string;
}) {
  const [region, setRegion] = useState<string>('all');
  const visible =
    region === 'all' ? peoples : peoples.filter((p) => p.region === region);

  const filters = [{key: 'all', label: allRegionsLabel}, ...regions];

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-[9px]">
        {filters.map((f) => {
          const on = region === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setRegion(f.key)}
              aria-pressed={on}
              className={`rounded-full border px-[15px] py-[7px] text-[13px] ${
                on
                  ? 'border-indigo bg-indigo font-semibold text-white'
                  : 'border-ligne bg-white text-gris'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-[22px] [grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr))]">
        {visible.map((person) => (
          <PeopleCard
            key={person.slug}
            person={person}
            taxonomies={taxonomies}
            locale={locale}
            readSheet={readSheet}
          />
        ))}
      </div>
    </>
  );
}
