import type {Partner} from '@/lib/types';

/**
 * Horizontal auto-scrolling strip of partner logos. The list is rendered
 * twice and translated by -50% so the loop is seamless; it pauses on hover.
 * Falls back to the partner name when no logo URL is set.
 */
export default function PartnersMarquee({partners}: {partners: Partner[]}) {
  if (partners.length === 0) return null;

  const Item = ({p}: {p: Partner}) => {
    const inner = p.logo ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={p.logo}
        alt={p.name}
        className="h-8 w-auto opacity-80 grayscale transition group-hover:opacity-100"
      />
    ) : (
      <span className="text-[14px] font-semibold text-gris">{p.name}</span>
    );
    const base =
      'flex shrink-0 items-center rounded border border-ligne bg-white px-6 py-3';
    return p.url ? (
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        title={p.name}
        className={`${base} group hover:border-indigo`}
      >
        {inner}
      </a>
    ) : (
      <span className={`${base} group`}>{inner}</span>
    );
  };

  return (
    <div className="group relative overflow-hidden pb-[70px] pt-[18px] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div className="flex w-max gap-[13px] animate-marquee group-hover:[animation-play-state:paused]">
        {[...partners, ...partners].map((p, i) => (
          <Item key={`${p.name}-${i}`} p={p} />
        ))}
      </div>
    </div>
  );
}
