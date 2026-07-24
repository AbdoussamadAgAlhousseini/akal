'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {SearchEntry} from '@/lib/types';

const MAX_RESULTS = 8;

/**
 * Header global search: button + modal with the `/` shortcut and Esc-to-close.
 * Filters the pre-built, PUBLIC-only index (peoples, organizations, news,
 * calls) passed from the server. Selecting a result navigates to its page.
 */
export default function Search({entries}: {entries: SearchEntry[]}) {
  const t = useTranslations('Layout');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    // No query → no list (don't show a default dump of entries).
    if (!q) return [];
    return entries.filter((e) => e.haystack.includes(q)).slice(0, MAX_RESULTS);
  }, [query, entries]);

  // Global `/` opens search (unless already typing); Esc closes.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLElement &&
        (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
      if (e.key === '/' && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Focus the field when the modal opens; reset the query when it closes.
  useEffect(() => {
    if (open) inputRef.current?.focus();
    else setQuery('');
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('search')}
        className="flex items-center gap-2 rounded border border-white/35 px-[13px] py-1.5 text-[12.5px] text-white hover:border-white"
      >
        <span aria-hidden>⌕</span>
        <span className="hidden sm:inline">{t('search')}</span>
        <kbd className="hidden rounded-[3px] bg-white/15 px-1.5 py-px text-[11px] sm:inline">
          /
        </kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('search')}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          className="fixed inset-0 z-[3000] flex items-start justify-center bg-indigo/55 px-5 pt-[11vh]"
        >
          <div className="w-full max-w-[620px] overflow-hidden rounded-lg bg-white shadow-[0_24px_64px_rgba(0,0,0,0.3)]">
            <input
              ref={inputRef}
              type="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full border-b border-ligne bg-white px-[22px] py-[17px] text-[17px] text-encre outline-none placeholder:text-gris"
            />
            <div className="max-h-[50vh] overflow-y-auto">
              {!query.trim() ? null : results.length ? (
                results.map((r, i) => (
                  <Link
                    key={`${r.kind}-${i}`}
                    href={r.href}
                    onClick={close}
                    className="block border-b border-sable-2 px-[22px] py-3 text-encre hover:bg-sable"
                  >
                    <span className="float-right mt-[3px] text-[10.5px] font-bold uppercase tracking-[0.1em] text-laterite">
                      {r.kind}
                    </span>
                    <b className="block font-serif text-[15.5px] text-indigo">
                      {r.title}
                    </b>
                    <span className="text-[12.5px] text-gris">{r.subtitle}</span>
                  </Link>
                ))
              ) : (
                <div className="px-6 py-[26px] text-center text-sm text-gris">
                  {t('searchEmpty')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
