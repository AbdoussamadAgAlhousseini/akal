'use client';

import {useRef, useState} from 'react';
import {useTranslations} from 'next-intl';

const TYPES = ['correction', 'factSheet', 'translation', 'organization', 'other'] as const;

// Form values → stored `type` codes.
const TYPE_CODE: Record<(typeof TYPES)[number], string> = {
  correction: 'correction',
  factSheet: 'fact_sheet',
  translation: 'translation',
  organization: 'organization',
  other: 'other'
};

export default function ContributeForm() {
  const t = useTranslations('Contribute');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<(typeof TYPES)[number]>('correction');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const hpRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid =
      name.trim().length > 1 &&
      email.includes('@') &&
      email.lastIndexOf('.') > email.indexOf('@') &&
      message.trim().length > 2;
    if (!valid) {
      setStatus('err');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/contribute', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          type: TYPE_CODE[type],
          message: message.trim(),
          website: hpRef.current?.value || ''
        })
      });
      if (res.ok) {
        setStatus('ok');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('err');
      }
    } catch {
      setStatus('err');
    } finally {
      setSubmitting(false);
    }
  }

  const field =
    'w-full rounded border border-ligne bg-white px-3 py-2.5 text-[14px]';
  const label =
    'mb-[5px] block text-[11.5px] font-bold uppercase tracking-[0.07em] text-gris';

  return (
    <div className="max-w-[680px] rounded-md border border-l-4 border-ligne border-l-laterite bg-white px-[30px] py-7">
      <form onSubmit={onSubmit} className="flex flex-col gap-[15px]">
        <input
          ref={hpRef}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
        />
        <div className="grid grid-cols-1 gap-[15px] sm:grid-cols-2">
          <div>
            <label htmlFor="c-name" className={label}>
              {t('name')} *
            </label>
            <input
              id="c-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="c-email" className={label}>
              {t('email')} *
            </label>
            <input
              id="c-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </div>
        </div>
        <div>
          <label htmlFor="c-type" className={label}>
            {t('type')}
          </label>
          <select
            id="c-type"
            value={type}
            onChange={(e) => setType(e.target.value as (typeof TYPES)[number])}
            className={field}
          >
            {TYPES.map((code) => (
              <option key={code} value={code}>
                {t(`types.${code}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="c-message" className={label}>
            {t('message')} *
          </label>
          <textarea
            id="c-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('messagePlaceholder')}
            className={`${field} min-h-[120px] resize-y`}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-laterite px-6 py-3 text-[14.5px] font-semibold text-white hover:bg-[#9E501B] disabled:opacity-60"
          >
            {t('send')}
          </button>
        </div>
      </form>
      {status === 'ok' && (
        <p
          className="mt-[15px] rounded bg-[#E3EBE6] px-4 py-3 text-[14px] font-semibold text-ok"
          role="status"
        >
          {t('ok')}
        </p>
      )}
      {status === 'err' && (
        <p
          className="mt-[15px] rounded bg-[#F6E0DA] px-4 py-3 text-[13.5px] font-semibold text-[#8A3A22]"
          role="alert"
        >
          {t('err')}
        </p>
      )}
    </div>
  );
}
