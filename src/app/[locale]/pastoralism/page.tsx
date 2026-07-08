import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/lib/seo';
import Container from '@/components/common/Container';
import PageHead from '@/components/common/PageHead';
import Slider from '@/components/common/Slider';
import SectionBlocks from '@/components/common/SectionBlocks';
import {getPastoralismBlocks, getSlides} from '@/lib/content';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Pastoralism'});
  return buildMetadata({
    locale,
    href: '/pastoralism',
    title: `${t('title')} — AKAL`,
    description: t('lead')
  });
}

export default async function PastoralismPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Pastoralism');
  const th = await getTranslations('Home');
  const tn = await getTranslations('Nav');

  const blocks = getPastoralismBlocks();
  const slides = getSlides('pastoralism');

  return (
    <section className="pb-[70px]">
      <Container className="pt-11">
        <PageHead
          eyebrow={tn('pastoralism')}
          title={t('title')}
          lead={t('lead')}
        />

        <div className="mb-6 rounded-r border-l-4 border-indigo bg-[#EDEFF7] px-[17px] py-[13px] text-[13.5px] text-indigo">
          {t('iyrp')}
        </div>

        <div className="mb-8">
          <Slider slides={slides} locale={locale} note={th('sliderNote')} />
        </div>

        <SectionBlocks blocks={blocks} locale={locale} />
      </Container>
    </section>
  );
}
