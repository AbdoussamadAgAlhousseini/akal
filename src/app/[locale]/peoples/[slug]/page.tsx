import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import Container from '@/components/common/Container';
import PeopleFiche from '@/components/peoples/PeopleFiche';
import {routing} from '@/i18n/routing';
import {getPeople, getPeopleSlugs, getTaxonomies} from '@/lib/content';

type Props = {
  params: Promise<{locale: string; slug: string}>;
};

// Pre-render every public fact sheet in every locale. Non-public slugs are
// never emitted (the loader filters `visibility`).
export function generateStaticParams() {
  const slugs = getPeopleSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({locale, slug}))
  );
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params;
  const person = getPeople(slug);
  return {title: person ? `AKAL — ${person.name}` : 'AKAL'};
}

export default async function PeopleFichePage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  // Server-side visibility gate (§7.1): restricted/community/unpublished → 404.
  const person = getPeople(slug);
  if (!person) notFound();

  const taxonomies = getTaxonomies();

  return (
    <section>
      <Container>
        <PeopleFiche person={person} taxonomies={taxonomies} locale={locale} />
      </Container>
    </section>
  );
}
