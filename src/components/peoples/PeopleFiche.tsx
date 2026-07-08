import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale, People, PeopleSections, Taxonomies} from '@/lib/types';
import {localize} from '@/lib/localize';
import PrintButton from './PrintButton';

// Static ratification sidebar — same reference block for every fact sheet in
// the prototype.
const INSTRUMENT_ROWS: [string, string][] = [
  ['UNDRIP / DNUDPA', '✓'],
  ['ILO C169', '—'],
  ['CBD 8(j)', '✓'],
  ['ACHPR / CADHP', '✓']
];

/**
 * Full people fact sheet. Handles the translation fallback: fully documented
 * peoples show their long sections; if the section bundle is missing for the
 * active language it falls back to English with a "translation coming" banner.
 * Peoples without long sections show a work-in-progress notice + summary.
 */
export default async function PeopleFiche({
  person,
  taxonomies,
  locale
}: {
  person: People;
  taxonomies: Taxonomies;
  locale: string;
}) {
  const t = await getTranslations('Fiche');
  const tp = await getTranslations('Peoples');
  const tn = await getTranslations('Nav');

  const regionLabel = localize(taxonomies.regions[person.region], locale);
  const statusLabel = person.recognition
    .map((r) => localize(taxonomies.status[r], locale))
    .join(' · ');

  // Resolve which section language to display + whether to warn.
  const hasSections = Boolean(person.sections);
  const sectionLang: Locale =
    hasSections && person.sections?.[locale as Locale] ? (locale as Locale) : 'en';
  const showTranslationNotice = hasSections && !person.sections?.[locale as Locale];
  const sections = person.sections?.[sectionLang];

  const sectionOrder: {key: keyof PeopleSections; label: string}[] = [
    {key: 'identity', label: t('secIdentity')},
    {key: 'livelihoods', label: t('secLivelihoods')},
    {key: 'rights', label: t('secRights')},
    {key: 'threats', label: t('secThreats')}
  ];

  return (
    <div className="pb-[70px] pt-11">
      <div className="no-print">
        <p className="mb-1.5 text-[13px] text-gris">
          <Link href="/peoples" className="font-semibold text-laterite">
            {tn('peoples')}
          </Link>{' '}
          › {regionLabel} › <b>{person.name}</b>
        </p>
        <Link
          href="/peoples"
          className="text-[13.5px] font-semibold text-laterite hover:underline"
        >
          {tp('back')}
        </Link>
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          <PrintButton label={t('print')} />
        </div>
      </div>

      <article className="mt-[18px] rounded-md border border-ligne bg-white">
        {/* Head */}
        <header className="relative overflow-hidden rounded-t-md bg-indigo px-9 py-8 text-white">
          <span
            aria-hidden
            className="pointer-events-none absolute right-[18px] top-[-14px] select-none font-serif text-[120px] tracking-[0.1em] text-white/[0.06]"
          >
            {person.endonym.slice(0, 4)}
          </span>
          <div className="mb-[11px] text-[11px] uppercase tracking-[0.22em] text-[#B9C0DE]">
            {t('doc')} · AK-{person.slug.toUpperCase().slice(0, 6)}-2026
          </div>
          <div className="font-serif text-[32px] tracking-[0.14em] text-or">
            {person.endonym}
          </div>
          <h1 className="mt-1 font-serif text-[31px] font-semibold">
            {person.name}
          </h1>
          <div className="mt-1.5 text-[14px] italic text-[#C9CEE6]">
            {regionLabel}
          </div>
        </header>

        {/* Meta strip */}
        <div className="grid border-b border-ligne bg-sable-2 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
          {[
            {label: t('population'), value: person.population},
            {label: t('language'), value: localize(person.language, locale)},
            {label: t('countries'), value: localize(person.countries, locale)},
            {label: t('status'), value: statusLabel}
          ].map((m) => (
            <div key={m.label} className="border-r border-ligne px-5 py-[15px] last:border-r-0">
              <label className="mb-1 block text-[10.5px] font-bold uppercase tracking-[0.15em] text-gris">
                {m.label}
              </label>
              <b className="text-[14.5px] text-indigo">{m.value}</b>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="grid gap-[42px] px-9 py-[34px] lg:[grid-template-columns:1fr_290px]">
          <div>
            {showTranslationNotice && (
              <div className="mb-6 rounded-r border-l-4 border-indigo bg-[#EDEFF7] px-[17px] py-[13px] text-[13.5px] text-indigo">
                {t('translation')}
              </div>
            )}
            {!hasSections && (
              <div className="mb-6 rounded-r border-l-4 border-indigo bg-[#EDEFF7] px-[17px] py-[13px] text-[13.5px] text-indigo">
                {t('wip')}
              </div>
            )}

            {sections
              ? sectionOrder.map((s) => (
                  <section key={s.key} className="mb-[30px]">
                    <h2 className="mb-[13px] inline-block border-b-2 border-laterite pb-1 font-serif text-[19px] font-semibold text-indigo">
                      {s.label}
                    </h2>
                    <p className="text-[15px]">{sections![s.key]}</p>
                  </section>
                ))
              : (
                <section className="mb-[30px]">
                  <p className="text-[15px]">{localize(person.summary, locale)}</p>
                </section>
              )}

            {/* TK label (§7.7) */}
            <div className="flex gap-3 rounded-md border border-dashed border-laterite bg-[#F4EEE2] px-4 py-3.5 text-[13px] text-[#6B4A22]">
              <span className="text-[20px]">◈</span>
              <span>{t('tk')}</span>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <SideBox title={t('keyFacts')}>
              <SideRow k={t('population')} v={person.population} />
              <SideRow k={t('region')} v={regionLabel} />
              <SideRow
                k={t('status')}
                v={localize(taxonomies.status[person.recognition[0]], locale)}
              />
            </SideBox>

            <SideBox title={t('instruments')}>
              {INSTRUMENT_ROWS.map(([name, mark]) => (
                <SideRow key={name} k={name} v={mark} />
              ))}
            </SideBox>

            <div className="rounded-md border border-ligne bg-sable px-[21px] py-[19px]">
              <h3 className="mb-[11px] text-[11.5px] font-bold uppercase tracking-[0.15em] text-laterite">
                {t('sources')}
              </h3>
              <p className="text-[13px] text-gris">{t('sourcesText')}</p>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}

function SideBox({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <div className="mb-[18px] rounded-md border border-ligne bg-sable px-[21px] py-[19px]">
      <h3 className="mb-[11px] text-[11.5px] font-bold uppercase tracking-[0.15em] text-laterite">
        {title}
      </h3>
      <table className="w-full border-collapse text-[13.5px]">
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function SideRow({k, v}: {k: string; v: string}) {
  return (
    <tr>
      <td className="border-b border-ligne py-1.5 pr-2.5 align-top text-gris">
        {k}
      </td>
      <td className="border-b border-ligne py-1.5 text-right align-top font-semibold text-indigo">
        {v}
      </td>
    </tr>
  );
}
