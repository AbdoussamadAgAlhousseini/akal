import {getTranslations, setRequestLocale} from 'next-intl/server';
import Container from '@/components/common/Container';
import PageHead from '@/components/common/PageHead';
import OrgDirectory from '@/components/organizations/OrgDirectory';
import JoinForm from '@/components/organizations/JoinForm';
import {getOrganizations, getTaxonomies} from '@/lib/content';
import {localize} from '@/lib/localize';

export default async function OrganizationsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Organizations');
  const tn = await getTranslations('Nav');

  const orgs = getOrganizations();
  const taxonomies = getTaxonomies();

  // Membership categories: every category except the "all" filter entry.
  const joinCategories = Object.entries(taxonomies.categories)
    .filter(([key]) => key !== 'all')
    .map(([key, label]) => ({key, label: localize(label, locale)}));

  return (
    <section className="pb-[70px]">
      <Container className="pt-11">
        <PageHead
          eyebrow={tn('organizations')}
          title={t('title')}
          lead={t('lead')}
        />
        <OrgDirectory orgs={orgs} taxonomies={taxonomies} locale={locale} />
        <JoinForm categories={joinCategories} />
      </Container>
    </section>
  );
}
