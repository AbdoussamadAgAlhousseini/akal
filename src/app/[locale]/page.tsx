import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import Container from '@/components/common/Container';
import Slider from '@/components/common/Slider';
import FeaturedPeople from '@/components/home/FeaturedPeople';
import NewsList from '@/components/news/NewsList';
import {
  getFeaturedPeople,
  getHome,
  getNews,
  getOrganizations,
  getPeoples,
  getSlides,
  getTaxonomies
} from '@/lib/content';

type Props = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Home');

  const home = getHome();
  const peoples = await getPeoples();
  const orgs = await getOrganizations();
  const taxonomies = getTaxonomies();
  const featured = await getFeaturedPeople();
  const news = await getNews();
  const slides = getSlides('home');

  const stats = [
    {value: home.stats.indigenousPersons, label: t('statPersons')},
    {value: home.stats.distinctPeoples, label: t('statPeoples')},
    {value: String(peoples.length), label: t('statDocumented')},
    {value: String(orgs.length), label: t('statOrgs')}
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-indigo pt-16 text-white">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-5 top-1.5 select-none font-serif text-[210px] leading-none tracking-[0.1em] text-white/[0.045]"
        >
          ⵜⵎⵛⵗ
        </span>

        <Container>
          <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[0.18em] text-or">
            {t('eyebrow')}
          </p>
          <h1 className="max-w-[720px] font-serif text-[clamp(29px,4.5vw,45px)] font-semibold leading-[1.18]">
            {t('title')}
          </h1>
          <p className="mt-4 max-w-[640px] text-[17px] text-[#C9CEE6]">
            {t('sub')}
          </p>
          <div className="mt-7 flex flex-wrap gap-3.5">
            <Link
              href="/peoples"
              className="rounded bg-laterite px-6 py-3 text-[14.5px] font-semibold text-white hover:bg-[#9E501B]"
            >
              {t('cta1')}
            </Link>
            <Link
              href="/map"
              className="rounded border-[1.5px] border-white/50 px-6 py-3 text-[14.5px] font-semibold text-white"
            >
              {t('cta2')}
            </Link>
          </div>
        </Container>

        {/* Stat band */}
        <div className="mt-[52px] border-t border-white/[0.14] bg-white/[0.06]">
          <div className="mx-auto grid max-w-[1200px] gap-4 px-6 py-5 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
            {stats.map((s) => (
              <div key={s.label}>
                <b className="block font-serif text-[29px] font-semibold text-or">
                  {s.value}
                </b>
                <span className="text-[12px] uppercase tracking-[0.05em] text-[#C9CEE6]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Container>
        <div className="pt-[42px]">
          <Slider slides={slides} locale={locale} note={t('sliderNote')} />
        </div>

        {featured && (
          <FeaturedPeople
            person={featured}
            taxonomies={taxonomies}
            locale={locale}
            label={t('featuredLabel')}
            readSheet={t('readSheet')}
          />
        )}

        <h2 className="mb-1.5 mt-[52px] font-serif text-[26px] font-semibold text-indigo">
          {t('latestHeading')}
        </h2>
        <p className="mb-6 text-[15px] text-gris">{t('latestSub')}</p>
        <NewsList items={news} locale={locale} limit={2} />

        <h2 className="mb-1.5 mt-[52px] font-serif text-[26px] font-semibold text-indigo">
          {t('partnersHeading')}
        </h2>
        <div className="mt-[18px] flex flex-wrap items-center gap-[13px] pb-[70px]">
          {home.partners.map((p) => {
            const inner = p.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.logo} alt={p.name} className="h-7 w-auto" />
            ) : (
              <span className="text-[13px] font-semibold text-gris">{p.name}</span>
            );
            const base =
              'flex items-center rounded border border-ligne bg-white px-5 py-[11px]';
            return p.url ? (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                title={p.name}
                className={`${base} hover:border-indigo`}
              >
                {inner}
              </a>
            ) : (
              <span key={p.name} className={base}>
                {inner}
              </span>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
