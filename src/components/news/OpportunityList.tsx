import type {Opportunity} from '@/lib/types';
import {localize} from '@/lib/localize';

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
            <span className="mt-2 inline-block rounded-full bg-[#F6E7DA] px-3 py-[3px] text-[12px] font-bold text-laterite">
              {localize(opp.deadline, locale)}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
