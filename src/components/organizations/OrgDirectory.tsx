'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import type {Organization, Taxonomies} from '@/lib/types';
import {localize} from '@/lib/localize';

/**
 * Organizations directory with a cross filter: category (buttons) AND country
 * (select), reproducing the prototype's double filter.
 */
export default function OrgDirectory({
  orgs,
  taxonomies,
  locale
}: {
  orgs: Organization[];
  taxonomies: Taxonomies;
  locale: string;
}) {
  const t = useTranslations('Layout');
  const [category, setCategory] = useState('all');
  const [country, setCountry] = useState('all');

  const categoryKeys = Object.keys(taxonomies.categories); // all, gen, women, youth, pastoral
  const usedCountries = ['all', ...Array.from(new Set(orgs.map((o) => o.country)))];

  const visible = orgs.filter(
    (o) =>
      (category === 'all' || o.category === category) &&
      (country === 'all' || o.country === country)
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-[9px]">
        {categoryKeys.map((key) => {
          const on = category === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              aria-pressed={on}
              className={`rounded-full border px-[15px] py-[7px] text-[13px] ${
                on
                  ? 'border-indigo bg-indigo font-semibold text-white'
                  : 'border-ligne bg-white text-gris'
              }`}
            >
              {localize(taxonomies.categories[key], locale)}
            </button>
          );
        })}
      </div>

      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        aria-label={localize(taxonomies.countries.all, locale)}
        className="mb-6 max-w-[280px] rounded border border-ligne bg-white px-3.5 py-[9px] text-[13.5px]"
      >
        {usedCountries.map((code) => (
          <option key={code} value={code}>
            {localize(taxonomies.countries[code], locale)}
          </option>
        ))}
      </select>

      {visible.length ? (
        <div className="grid gap-[22px] [grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr))]">
          {visible.map((org) => (
            <div
              key={org.name}
              className="overflow-hidden rounded-md border border-ligne bg-white transition-shadow hover:shadow-[0_8px_24px_rgba(31,42,94,0.10)]"
            >
              <div className="px-5 pb-5 pt-[22px]">
                <span className="mb-[9px] inline-block rounded-full bg-sable-2 px-2.5 py-[3px] text-[10.5px] font-bold uppercase tracking-[0.07em] text-indigo">
                  {localize(taxonomies.categories[org.category], locale)}
                </span>
                <h3 className="mb-1 font-serif text-[19px] text-indigo">
                  {org.name}
                </h3>
                <div className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-laterite">
                  {localize(taxonomies.countries[org.country], locale)}
                </div>
                <p className="text-[14px] text-gris">
                  {localize(org.mission, locale)}
                </p>
                {(org.url || org.email) && (
                  <div className="mt-3 flex flex-col gap-1 border-t border-ligne pt-3 text-[13px]">
                    {org.url && (
                      <a
                        href={org.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-laterite hover:underline"
                      >
                        {org.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
                      </a>
                    )}
                    {org.email && (
                      <a
                        href={`mailto:${org.email}`}
                        className="text-indigo hover:underline"
                      >
                        {org.email}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gris">{t('searchEmpty')}</p>
      )}
    </>
  );
}
