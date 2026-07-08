import type {NewsItem} from '@/lib/types';
import {localize} from '@/lib/localize';

/** List of curated news items (prototype `.newsitem`). */
export default function NewsList({
  items,
  locale,
  limit
}: {
  items: NewsItem[];
  locale: string;
  limit?: number;
}) {
  const visible = limit ? items.slice(0, limit) : items;

  return (
    <div>
      {visible.map((item, i) => (
        <article
          key={i}
          className="mb-[15px] flex gap-[18px] rounded-md border border-ligne bg-white px-[22px] py-5"
        >
          <div className="min-w-[70px] self-start rounded-md bg-sable-2 px-1.5 py-[9px] text-center">
            <b className="block font-serif text-[21px] text-indigo">
              {item.day}
            </b>
            <span className="text-[11px] uppercase tracking-[0.08em] text-gris">
              {localize(item.month, locale)}
            </span>
          </div>
          <div>
            <h3 className="mb-[5px] font-serif text-[17.5px] text-indigo">
              {localize(item.title, locale)}
            </h3>
            <p className="text-[14px] text-gris">{localize(item.body, locale)}</p>
            <span className="mt-1.5 block text-[12px] font-semibold text-laterite">
              {localize(item.source, locale)}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
