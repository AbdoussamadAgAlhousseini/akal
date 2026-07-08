'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

/**
 * Footer newsletter sign-up. Client-side validation + confirmation only;
 * the real subscription endpoint is wired later (roadmap step 3, backend).
 */
export default function NewsletterForm() {
  const t = useTranslations('Footer');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.includes('@') && email.includes('.')) {
      setDone(true);
      setEmail('');
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="mt-2.5 flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('newsletterPlaceholder')}
          aria-label={t('newsletterPlaceholder')}
          className="min-w-0 flex-1 rounded border border-white/25 bg-white/[0.08] px-3 py-2.5 text-[13.5px] text-white placeholder:text-[#8E96BE]"
        />
        <button
          type="submit"
          className="rounded bg-laterite px-[15px] py-2.5 text-[13.5px] font-semibold text-white hover:bg-[#9E501B]"
        >
          {t('newsletterButton')}
        </button>
      </form>
      {done && (
        <p className="mt-2 text-[13px] text-[#8FD3AE]" role="status">
          {t('newsletterOk')}
        </p>
      )}
    </div>
  );
}
