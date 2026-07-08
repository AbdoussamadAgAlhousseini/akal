import {getTranslations, setRequestLocale} from 'next-intl/server';
import Container from '@/components/common/Container';
import PageHead from '@/components/common/PageHead';
import SectionBlocks from '@/components/common/SectionBlocks';
import {getAboutBlocks} from '@/lib/content';

export default async function AboutPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('About');
  const tn = await getTranslations('Nav');

  const blocks = getAboutBlocks();

  return (
    <section className="pb-[70px]">
      <Container className="pt-11">
        <PageHead eyebrow={tn('about')} title={t('title')} lead={t('lead')} />
        <SectionBlocks blocks={blocks} locale={locale} />
      </Container>
    </section>
  );
}
