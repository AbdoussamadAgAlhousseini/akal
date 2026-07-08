'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

/**
 * Membership request form. Client-side validation + confirmation only; the
 * real submission (queued as `pending`, human-reviewed — never auto-published,
 * §7.6) is wired at the backend stage. Category options come from the taxonomy.
 */
export default function JoinForm({
  categories
}: {
  categories: {key: string; label: string}[];
}) {
  const t = useTranslations('Organizations');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState(categories[0]?.key ?? '');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid =
      org.trim().length > 1 &&
      email.includes('@') &&
      email.lastIndexOf('.') > email.indexOf('@');
    if (valid) {
      setStatus('ok');
      setOrg('');
      setEmail('');
      setCountry('');
      setMessage('');
    } else {
      setStatus('err');
    }
  }

  const field =
    'w-full rounded border border-ligne bg-white px-3 py-2.5 text-[14px]';
  const label =
    'mb-[5px] block text-[11.5px] font-bold uppercase tracking-[0.07em] text-gris';

  return (
    <div className="mt-[46px] rounded-md border border-l-4 border-ligne border-l-laterite bg-white px-[30px] py-7">
      <h2 className="mb-1.5 font-serif text-[22px] text-indigo">
        {t('joinHeading')}
      </h2>
      <p className="mb-[18px] text-[14px] text-gris">{t('joinText')}</p>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-[15px] sm:grid-cols-2"
      >
        <div>
          <label htmlFor="j-org" className={label}>
            {t('fieldOrg')} *
          </label>
          <input
            id="j-org"
            type="text"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="j-email" className={label}>
            {t('fieldEmail')} *
          </label>
          <input
            id="j-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="j-country" className={label}>
            {t('fieldCountry')}
          </label>
          <input
            id="j-country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="j-category" className={label}>
            {t('fieldCategory')}
          </label>
          <select
            id="j-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={field}
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="j-message" className={label}>
            {t('fieldMessage')}
          </label>
          <textarea
            id="j-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${field} min-h-[88px] resize-y`}
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded bg-laterite px-6 py-3 text-[14.5px] font-semibold text-white hover:bg-[#9E501B]"
          >
            {t('send')}
          </button>
        </div>
      </form>

      {status === 'ok' && (
        <p className="mt-[15px] rounded bg-[#E3EBE6] px-4 py-3 text-[14px] font-semibold text-ok" role="status">
          {t('ok')}
        </p>
      )}
      {status === 'err' && (
        <p className="mt-[15px] rounded bg-[#F6E0DA] px-4 py-3 text-[13.5px] font-semibold text-[#8A3A22]" role="alert">
          {t('err')}
        </p>
      )}
    </div>
  );
}
