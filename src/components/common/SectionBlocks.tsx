import type {ContentBlock} from '@/lib/types';
import {localize} from '@/lib/localize';

/** Grid of titled text blocks (prototype `.secblock` inside `.grid.g2`). */
export default function SectionBlocks({
  blocks,
  locale
}: {
  blocks: ContentBlock[];
  locale: string;
}) {
  return (
    <div className="grid gap-[22px] [grid-template-columns:repeat(auto-fill,minmax(min(360px,100%),1fr))]">
      {blocks.map((block, i) => (
        <div
          key={i}
          className="rounded-md border border-ligne bg-white px-7 py-[26px]"
        >
          <h2 className="mb-2.5 font-serif text-[20px] text-indigo">
            {localize(block.heading, locale)}
          </h2>
          <p className="text-[14.5px] text-[#3E3B34]">
            {localize(block.body, locale)}
          </p>
        </div>
      ))}
    </div>
  );
}
