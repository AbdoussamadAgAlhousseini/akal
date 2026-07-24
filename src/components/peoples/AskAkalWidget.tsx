'use client';

import {useRef, useState} from 'react';

type L = 'en' | 'fr' | 'es';

const T: Record<L, {
  title: string;
  hint: string;
  placeholder: string;
  examples: string[];
  ask: string;
  asking: string;
  disclaimer: string;
  error: string;
  unconfigured: string;
  close: string;
}> = {
  fr: {
    title: 'Demandez à AKAL',
    hint: 'Posez une question sur AKAL, un peuple, une organisation, l’actualité ou une opportunité. Les réponses s’appuient uniquement sur le contenu du site.',
    placeholder: 'Ex. À quoi sert AKAL ?',
    examples: ['Qu’est-ce qu’AKAL ?', 'Quelles opportunités sont ouvertes ?', 'Où vivent les Sámi ?'],
    ask: 'Demander',
    asking: 'Recherche…',
    disclaimer: 'Réponse générée à partir des fiches du site. Vérifiez les sources sur la fiche concernée.',
    error: 'Une erreur est survenue. Réessayez.',
    unconfigured: 'L’assistant n’est pas encore activé.',
    close: 'Fermer'
  },
  en: {
    title: 'Ask AKAL',
    hint: 'Ask about AKAL, a people, an organization, the news or an opportunity. Answers draw only on the site’s content.',
    placeholder: 'e.g. What is AKAL for?',
    examples: ['What is AKAL?', 'What opportunities are open?', 'Where do the Sámi live?'],
    ask: 'Ask',
    asking: 'Searching…',
    disclaimer: 'Answer generated from the site’s fact sheets. Check the sources on the relevant page.',
    error: 'Something went wrong. Please try again.',
    unconfigured: 'The assistant is not enabled yet.',
    close: 'Close'
  },
  es: {
    title: 'Pregunte a AKAL',
    hint: 'Pregunte sobre AKAL, un pueblo, una organización, las noticias o una oportunidad. Las respuestas se basan solo en el contenido del sitio.',
    placeholder: 'Ej. ¿Para qué sirve AKAL?',
    examples: ['¿Qué es AKAL?', '¿Qué oportunidades hay abiertas?', '¿Dónde viven los Sámi?'],
    ask: 'Preguntar',
    asking: 'Buscando…',
    disclaimer: 'Respuesta generada a partir de las fichas del sitio. Verifique las fuentes en la ficha correspondiente.',
    error: 'Se produjo un error. Inténtelo de nuevo.',
    unconfigured: 'El asistente aún no está activado.',
    close: 'Cerrar'
  }
};

export default function AskAkalWidget({locale}: {locale: string}) {
  const t = T[(['en', 'fr', 'es'].includes(locale) ? locale : 'en') as L];
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const hpRef = useRef<HTMLInputElement>(null);

  async function submit(q: string) {
    const query = q.trim();
    if (query.length < 3 || loading) return;
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question: query, locale, website: hpRef.current?.value || ''})
      });
      if (res.status === 503) setError(t.unconfigured);
      else if (!res.ok) setError(t.error);
      else {
        const data = await res.json();
        setAnswer(data.answer || t.error);
        setQuestion(''); // clear the field, ready for the next question
      }
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div className="flex max-h-[min(560px,80vh)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-xl border border-ligne bg-white shadow-[0_12px_40px_rgba(20,28,66,0.28)]">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 bg-indigo px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/40 font-serif text-[15px] text-or">
                ⴰ
              </span>
              <span className="font-serif text-[16px] font-semibold">{t.title}</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={t.close}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[18px] text-[#C9CEE6] hover:bg-white/15 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3.5">
            <p className="text-[13px] text-gris">{t.hint}</p>

            {!answer && !loading && !error && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.examples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => {
                      setQuestion(ex);
                      submit(ex);
                    }}
                    className="rounded-full border border-ligne px-2.5 py-1 text-[12px] text-indigo hover:border-indigo hover:bg-sable-2"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <p className="mt-4 animate-pulse text-[14px] text-gris">{t.asking}</p>
            )}

            {error && (
              <p className="mt-4 rounded-md border-l-4 border-laterite bg-[#F6E7DA] px-3 py-2.5 text-[13.5px] text-[#6B4A22]">
                {error}
              </p>
            )}

            {answer && (
              <div className="mt-3">
                <div className="whitespace-pre-wrap rounded-md border border-ligne bg-sable px-3.5 py-3 text-[14.5px] leading-relaxed text-encre">
                  {answer}
                </div>
                <p className="mt-2 flex gap-1.5 text-[11.5px] text-gris">
                  <span aria-hidden>◈</span>
                  {t.disclaimer}
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(question);
            }}
            className="flex items-end gap-2 border-t border-ligne p-3"
          >
            <input
              ref={hpRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t.placeholder}
              maxLength={500}
              className="min-w-0 flex-1 rounded-md border border-ligne px-3 py-2 text-[14px] outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15"
            />
            <button
              type="submit"
              disabled={loading || question.trim().length < 3}
              className="shrink-0 rounded-md bg-laterite px-3.5 py-2 text-[13.5px] font-semibold text-white hover:bg-[#9E501B] disabled:opacity-60"
            >
              {loading ? '…' : t.ask}
            </button>
          </form>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full bg-laterite px-5 py-3 text-[14.5px] font-semibold text-white shadow-[0_8px_24px_rgba(180,94,35,0.4)] transition-colors hover:bg-[#9E501B]"
      >
        <span className="text-[17px]" aria-hidden>
          {open ? '✕' : '💬'}
        </span>
        {!open && <span>{t.title}</span>}
      </button>
    </div>
  );
}
