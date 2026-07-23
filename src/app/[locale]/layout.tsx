import type {Metadata, Viewport} from 'next';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {SITE_NAME, SITE_URL} from '@/lib/seo';
import {Analytics} from '@vercel/analytics/next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AskAkalWidget from '@/components/peoples/AskAkalWidget';
import StructuredData from '@/components/seo/StructuredData';
import '../globals.css';

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

// Pre-render one static variant per locale.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const viewport: Viewport = {
  themeColor: '#1F2A5E'
};

// Tifinagh mark (ⴰ) in gold on indigo — same favicon as the prototype.
const FAVICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='12' fill='%231F2A5E'/><text x='50' y='72' font-size='62' text-anchor='middle' fill='%23E9C46A' font-family='Georgia'>ⴰ</text></svg>";

export async function generateMetadata({
  params
}: Omit<Props, 'children'>): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  const title = t('title');
  const description = t('description');
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    icons: {icon: FAVICON},
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        en: `${SITE_URL}/en`,
        fr: `${SITE_URL}/fr`,
        es: `${SITE_URL}/es`,
        'x-default': `${SITE_URL}/en`
      }
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      locale,
      type: 'website'
    },
    twitter: {card: 'summary_large_image', title, description},
    // Set NEXT_PUBLIC_GOOGLE_VERIFICATION to the code Google Search Console
    // gives you (URL-prefix property → HTML tag method) to verify ownership.
    verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
      ? {google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION}
      : undefined
  };
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  // Reject unknown locales.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering for this request.
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <StructuredData locale={locale} />
        <NextIntlClientProvider>
          <Header />
          {children}
          <Footer />
          {process.env.ANTHROPIC_API_KEY && <AskAkalWidget locale={locale} />}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
