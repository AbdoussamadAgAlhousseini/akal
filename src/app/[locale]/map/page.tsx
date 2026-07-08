import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {buildMetadata} from '@/lib/seo';
import Container from '@/components/common/Container';
import PageHead from '@/components/common/PageHead';
import MapLoader from '@/components/map/MapLoader';
import {getPeoples} from '@/lib/content';
import {localize} from '@/lib/localize';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Map'});
  return buildMetadata({
    locale,
    href: '/map',
    title: `${t('title')} — AKAL`,
    description: t('lead')
  });
}

export default async function MapPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Map');
  const tn = await getTranslations('Nav');
  const tp = await getTranslations('Peoples');

  // Only public peoples reach the client (visibility filtered server-side).
  const items = getPeoples().map((p) => ({
    slug: p.slug,
    name: p.name,
    countries: localize(p.countries, locale),
    coords: p.coords,
    radius: p.radius,
    pastoral: p.pastoral
  }));

  return (
    <section className="pb-[70px]">
      <Container className="pt-11">
        <PageHead eyebrow={tn('map')} title={t('title')} lead={t('lead')} />

        <MapLoader items={items} readSheet={tp('readSheet')} />

        <div className="mt-3.5 flex flex-wrap gap-[22px] text-[13px] text-gris">
          <span>
            <i
              className="mr-[7px] inline-block h-3 w-3 rounded-full align-[-1px]"
              style={{background: '#B45E23'}}
            />
            {t('legendPastoral')}
          </span>
          <span>
            <i
              className="mr-[7px] inline-block h-3 w-3 rounded-full align-[-1px]"
              style={{background: '#1F2A5E'}}
            />
            {t('legendOther')}
          </span>
        </div>
        <p className="mt-3.5 max-w-[760px] text-[13px] italic text-gris">
          {t('note')}
        </p>
      </Container>
    </section>
  );
}
