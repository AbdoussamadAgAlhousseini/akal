'use client';

import {useRef, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';

/**
 * Footer newsletter sign-up. Posts to /api/newsletter with the current locale,
 * which stores the subscriber, adds them to the Resend audience and sends a
 * localized welcome email.
 */
export default function NewsletterForm() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const hpRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: email.trim(),
          locale,
          website: hpRef.current?.value || ''
        })
      });
      if (res.ok) {
        setDone(true);
        setEmail('');
      }
    } catch {
      // keep the form as-is on network error
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="mt-2.5 flex gap-2">
        <input
          ref={hpRef}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
        />
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
          disabled={submitting}
          className="rounded bg-laterite px-[15px] py-2.5 text-[13.5px] font-semibold text-white hover:bg-[#9E501B] disabled:opacity-60"
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
