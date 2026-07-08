'use client';

import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {NAV_SECTIONS} from '@/config/sections';

/**
 * Main tab bar (Home + 8 sections). Highlights the active tab based on the
 * current canonical pathname; a fact sheet under /peoples/[slug] keeps the
 * Peoples tab active.
 */
export default function NavTabs() {
  const t = useTranslations('Nav');
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="border-t border-white/15">
      <ul className="mx-auto flex max-w-[1200px] list-none overflow-x-auto">
        {NAV_SECTIONS.map((s) => {
          const active = isActive(s.href);
          return (
            <li key={s.href}>
              <Link
                href={s.href}
                aria-current={active ? 'page' : undefined}
                className={`block whitespace-nowrap border-b-[3px] px-[15px] py-3 text-[13.5px] ${
                  active
                    ? 'border-laterite font-semibold text-white'
                    : 'border-transparent text-white/85 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {t(s.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
