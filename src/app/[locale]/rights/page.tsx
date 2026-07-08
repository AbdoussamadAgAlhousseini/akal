import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/lib/seo';
import Container from '@/components/common/Container';
import PageHead from '@/components/common/PageHead';
import RightsTable from '@/components/rights/RightsTable';
import {getInstruments, getJurisprudence} from '@/lib/content';
import {localize} from '@/lib/localize';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Rights'});
  return buildMetadata({
    locale,
    href: '/rights',
    title: `${t('title')} — AKAL`,
    description: t('lead')
  });
}

export default async function RightsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Rights');
  const tn = await getTranslations('Nav');

  const instruments = getInstruments();
  const jurisprudence = getJurisprudence();

  return (
    <section className="pb-[70px]">
      <Container className="pt-11">
        <PageHead eyebrow={tn('rights')} title={t('title')} lead={t('lead')} />

        <RightsTable
          instruments={instruments}
          locale={locale}
          labels={{
            instrument: t('colInstrument'),
            scope: t('colScope'),
            nature: t('colNature'),
            binding: t('binding'),
            declarative: t('declarative')
          }}
        />

        <h2 className="mb-1.5 mt-[52px] font-serif text-[26px] font-semibold text-indigo">
          {t('jurisprudence')}
        </h2>
        <div className="mt-3.5 grid gap-[22px] [grid-template-columns:repeat(auto-fill,minmax(min(360px,100%),1fr))]">
          {jurisprudence.map((j) => (
            <div
              key={j.title}
              className="rounded-md border border-ligne bg-white px-7 py-[26px]"
            >
              <h3 className="mb-2.5 font-serif text-[20px] text-indigo">
                {j.title}
              </h3>
              <p className="text-[14.5px] text-[#3E3B34]">
                {localize(j.body, locale)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
