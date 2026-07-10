import {getLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {buildSearchIndex} from '@/lib/search-index';
import LangSwitcher from './LangSwitcher';
import NavTabs from './NavTabs';
import Search from './Search';

/**
 * Site header: institutional top bar, brand row (tifinagh mark + AKAL wordmark,
 * search, language switcher, Contribute CTA) and the sticky tab navigation.
 */
export default async function Header() {
  const t = await getTranslations('Layout');
  const locale = await getLocale();
  const searchIndex = await buildSearchIndex(locale);

  return (
    <>
      {/* Institutional strip */}
      <div className="flex justify-between bg-indigo-deep px-6 py-1.5 text-[12.5px] tracking-[0.02em] text-[#C9CEE6]">
        <span className="tracking-[0.35em] opacity-75">ⴰⴾⴰⵍ</span>
        <span className="hidden sm:inline">{t('topbar')}</span>
      </div>

      <header className="sticky top-0 z-[1000] bg-indigo text-white shadow-[0_2px_12px_rgba(20,28,66,0.25)]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-[13px]">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded border-[1.5px] border-white/50 font-serif text-[22px] text-or">
              ⴰ
            </span>
            <span>
              <span className="block font-serif text-[22px] font-semibold leading-[1.1]">
                AKAL
              </span>
              <span className="mt-[3px] block text-[11px] uppercase tracking-[0.13em] opacity-75">
                {t('tagline')}
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Search entries={searchIndex} />
            <LangSwitcher />
            <Link
              href="/contribute"
              className="rounded bg-laterite px-[17px] py-2.5 text-[13.5px] font-semibold text-white hover:bg-[#9E501B]"
            >
              {t('contribute')}
            </Link>
          </div>
        </div>

        <NavTabs />
      </header>
    </>
  );
}
