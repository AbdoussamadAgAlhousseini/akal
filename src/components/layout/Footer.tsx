import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import NewsletterForm from './NewsletterForm';

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/abdoussamad-ag-alhousseini-4b263a214',
    path: 'M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4v16h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-8.5c0-2.03-.04-4.64-2.83-4.64-2.83 0-3.27 2.2-3.27 4.5V24h-4V8z'
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/22391427701',
    path: 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.3c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1.1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3.1.2.1.7-.1 1.3z'
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/18yr5Dhtm4/?mibextid=wwXIfr',
    path: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z'
  }
];

/**
 * Site footer: mission + socials, Explore/Platform link columns and the
 * newsletter sign-up. Layout collapses from 4 → 2 → 1 columns.
 */
export default async function Footer() {
  const t = await getTranslations('Footer');
  const tn = await getTranslations('Nav');

  const explore = [
    {href: '/peoples', label: tn('peoples')},
    {href: '/map', label: tn('map')},
    {href: '/pastoralism', label: tn('pastoralism')},
    {href: '/rights', label: tn('rights')}
  ] as const;

  const platform = [
    {href: '/about', label: t('ethics')},
    {href: '/about', label: t('governance')},
    {href: '/organizations', label: t('join')}
  ] as const;

  return (
    <footer className="bg-indigo-deep text-[#B9C0DE]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-[34px] px-6 pb-7 pt-[46px] md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.4fr]">
        <div>
          <h2 className="mb-[13px] text-xs uppercase tracking-[0.15em] text-white">
            AKAL
          </h2>
          <p className="max-w-[300px] text-[13.5px]">{t('mission')}</p>
          <div className="mt-4 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 hover:bg-white/[0.12]"
              >
                <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-[#C9CEE6]">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-[13px] text-xs uppercase tracking-[0.15em] text-white">
            {t('explore')}
          </h2>
          {explore.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="mb-2 block text-[13.5px] hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div>
          <h2 className="mb-[13px] text-xs uppercase tracking-[0.15em] text-white">
            {t('platform')}
          </h2>
          {platform.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="mb-2 block text-[13.5px] hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div>
          <h2 className="mb-[13px] text-xs uppercase tracking-[0.15em] text-white">
            {t('newsletterHeading')}
          </h2>
          <p className="text-[13px]">{t('newsletterText')}</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/[0.12] px-4 py-[15px] text-center text-xs text-[#7C84AB]">
        © {new Date().getFullYear()} AKAL
      </div>
    </footer>
  );
}
