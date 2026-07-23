import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Container from '@/components/common/Container';
import PageHead from '@/components/common/PageHead';
import AskAkal from '@/components/peoples/AskAkal';
import PeoplesExplorer from '@/components/peoples/PeoplesExplorer';
import {getPeoples, getTaxonomies} from '@/lib/content';
import {localize} from '@/lib/localize';
import {buildMetadata} from '@/lib/seo';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Peoples'});
  return buildMetadata({
    locale,
    href: '/peoples',
    title: `${t('title')} — AKAL`,
    description: t('lead')
  });
}

export default async function PeoplesPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Peoples');
  const tn = await getTranslations('Nav');

  const peoples = await getPeoples();
  const taxonomies = getTaxonomies();

  const regions = Object.entries(taxonomies.regions).map(([key, label]) => ({
    key,
    label: localize(label, locale)
  }));

  return (
    <section className="pb-[70px]">
      <Container className="pt-11">
        <PageHead eyebrow={tn('peoples')} title={t('title')} lead={t('lead')} />
        <PeoplesExplorer
          peoples={peoples}
          taxonomies={taxonomies}
          locale={locale}
          regions={regions}
          allRegionsLabel={t('allRegions')}
          readSheet={t('readSheet')}
        />
        {process.env.ANTHROPIC_API_KEY && <AskAkal locale={locale} />}
      </Container>
    </section>
  );
}
