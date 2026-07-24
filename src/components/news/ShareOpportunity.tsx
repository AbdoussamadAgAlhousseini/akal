'use client';

import {useState} from 'react';

type L = 'en' | 'fr' | 'es';

const T: Record<L, {share: string; copied: string; via: string}> = {
  fr: {share: 'Partager', copied: 'Lien copié ✓', via: 'via AKAL'},
  en: {share: 'Share', copied: 'Link copied ✓', via: 'via AKAL'},
  es: {share: 'Compartir', copied: 'Enlace copiado ✓', via: 'vía AKAL'}
};

/**
 * Share an opportunity. Uses the native share sheet (mobile) when available,
 * otherwise copies the title + link to the clipboard.
 */
export default function ShareOpportunity({
  title,
  url,
  locale
}: {
  title: string;
  url: string;
  locale: string;
}) {
  const t = T[(['en', 'fr', 'es'].includes(locale) ? locale : 'en') as L];
  const [copied, setCopied] = useState(false);

  async function share() {
    const text = `${title} — ${t.via}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({title, text, url});
      } catch {
        // user cancelled — ignore
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${title}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — ignore
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-laterite hover:text-[#9E501B]"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81a3 3 0 1 0-3-3c0 .24.04.47.09.7L8.04 9.81A3 3 0 1 0 6 15c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65a2.92 2.92 0 1 0 2.92-2.92z" />
      </svg>
      {copied ? t.copied : t.share}
    </button>
  );
}
