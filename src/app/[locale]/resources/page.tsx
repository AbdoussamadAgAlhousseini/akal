import {getTranslations, setRequestLocale} from 'next-intl/server';
import Container from '@/components/common/Container';
import PageHead from '@/components/common/PageHead';
import SectionBlocks from '@/components/common/SectionBlocks';
import {getResourcesBlocks} from '@/lib/content';

export default async function ResourcesPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Resources');
  const tn = await getTranslations('Nav');

  const blocks = getResourcesBlocks();

  return (
    <section className="pb-[70px]">
      <Container className="pt-11">
        <PageHead eyebrow={tn('resources')} title={t('title')} lead={t('lead')} />
        <SectionBlocks blocks={blocks} locale={locale} />
      </Container>
    </section>
  );
}
