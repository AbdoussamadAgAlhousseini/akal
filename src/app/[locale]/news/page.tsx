import {getTranslations, setRequestLocale} from 'next-intl/server';
import Container from '@/components/common/Container';
import PageHead from '@/components/common/PageHead';
import NewsList from '@/components/news/NewsList';
import OpportunityList from '@/components/news/OpportunityList';
import {getNews, getOpportunities} from '@/lib/content';

export default async function NewsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('News');
  const tn = await getTranslations('Nav');

  const news = getNews();
  const opportunities = getOpportunities();

  return (
    <section className="pb-[70px]">
      <Container className="pt-11">
        <PageHead eyebrow={tn('news')} title={t('title')} lead={t('lead')} />

        <NewsList items={news} locale={locale} />

        <h2 className="mb-1.5 mt-[52px] font-serif text-[26px] font-semibold text-indigo">
          {t('agendaHeading')}
        </h2>
        <p className="mb-6 text-[15px] text-gris">{t('agendaSub')}</p>
        <OpportunityList items={opportunities} locale={locale} />
      </Container>
    </section>
  );
}
