import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Container from '@/components/common/Container';
import PageHead from '@/components/common/PageHead';
import ContributeForm from '@/components/contribute/ContributeForm';
import {buildMetadata} from '@/lib/seo';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Contribute'});
  return buildMetadata({
    locale,
    href: '/contribute',
    title: `${t('title')} — AKAL`,
    description: t('lead')
  });
}

export default async function ContributePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Contribute');
  const tl = await getTranslations('Layout');

  return (
    <section className="pb-[70px]">
      <Container className="pt-11">
        <PageHead eyebrow={tl('contribute')} title={t('title')} lead={t('lead')} />
        <ContributeForm />
      </Container>
    </section>
  );
}
