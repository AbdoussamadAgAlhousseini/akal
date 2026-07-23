import {getTranslations} from 'next-intl/server';
import {SITE_NAME, SITE_URL} from '@/lib/seo';

// Public social profiles used as the platform's `sameAs` presence.
const SAME_AS = [
  'https://www.linkedin.com/in/abdoussamad-ag-alhousseini-4b263a214'
];

/**
 * Schema.org JSON-LD (Organization + WebSite). Helps search engines understand
 * the site and can enable a sitelinks search box / richer results.
 */
export default async function StructuredData({locale}: {locale: string}) {
  const t = await getTranslations({locale, namespace: 'Metadata'});
  const description = t('description');

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      alternateName: 'ⴰⴾⴰⵍ',
      url: SITE_URL,
      description,
      sameAs: SAME_AS
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description,
      inLanguage: ['en', 'fr', 'es']
    }
  ];

  return (
    <script
      type="application/ld+json"
      // JSON-LD is trusted, generated content (no user input).
      dangerouslySetInnerHTML={{__html: JSON.stringify(graph)}}
    />
  );
}
