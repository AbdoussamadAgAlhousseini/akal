'use client';

import {useParams} from 'next/navigation';
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';

/**
 * EN / FR / ES switcher. Keeps the user on the current route (including dynamic
 * fact-sheet URLs) while swapping the locale. The chosen locale is remembered
 * via the NEXT_LOCALE cookie set by the next-intl middleware.
 */
export default function LangSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const active = useLocale();

  return (
    <div
      className="flex overflow-hidden rounded border border-white/35"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() =>
            router.replace(
              // @ts-expect-error -- next-intl validates params against the route
              {pathname, params},
              {locale}
            )
          }
          aria-current={locale === active ? 'true' : undefined}
          className={`px-[11px] py-1.5 text-[12.5px] ${
            locale === active
              ? 'bg-white font-bold text-indigo'
              : 'bg-transparent text-white'
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
