import type {Opportunity} from '@/lib/types';
import {localize} from '@/lib/localize';
import ShareOpportunity from './ShareOpportunity';

/** Agenda / open calls (prototype `.newsitem.opp` with a deadline pill). */
export default function OpportunityList({
  items,
  locale
}: {
  items: Opportunity[];
  locale: string;
}) {
  return (
    <div>
      {items.map((opp, i) => (
        <article
          key={i}
          className="mb-[15px] flex gap-[18px] rounded-md border border-l-4 border-ligne border-l-laterite bg-white px-[22px] py-5"
        >
          <div className="flex-1">
            <h3 className="mb-[5px] font-serif text-[17.5px] text-indigo">
              {localize(opp.title, locale)}
            </h3>
            <p className="text-[14px] text-gris">{localize(opp.body, locale)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="inline-block rounded-full bg-[#F6E7DA] px-3 py-[3px] text-[12px] font-bold text-laterite">
                {localize(opp.deadline, locale)}
              </span>
              {opp.link && (
                <a
                  href={opp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-semibold text-indigo underline decoration-or/60 underline-offset-2 hover:text-laterite"
                >
                  {locale === 'fr'
                    ? "Voir l'annonce officielle ↗"
                    : locale === 'es'
                      ? 'Ver el anuncio oficial ↗'
                      : 'View official announcement ↗'}
                </a>
              )}
              <ShareOpportunity
                title={localize(opp.title, locale)}
                url={opp.link || `https://akal-indigenous.org/${locale}`}
                locale={locale}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
