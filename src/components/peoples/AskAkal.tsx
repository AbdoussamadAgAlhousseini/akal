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
}> = {
  fr: {
    title: 'Demandez à AKAL',
    hint: 'Posez une question sur un peuple. Les réponses s’appuient uniquement sur les fiches validées du site.',
    placeholder: 'Ex. Pourquoi les Touaregs portent-ils le voile ?',
    examples: [
      'Où vivent les Sámi ?',
      'Quelle langue parlent les Maasai ?',
      'Qui sont les Quechua ?'
    ],
    ask: 'Demander',
    asking: 'Recherche…',
    disclaimer:
      'Réponse générée à partir des fiches du site. Vérifiez les sources sur la fiche du peuple concerné.',
    error: 'Une erreur est survenue. Réessayez dans un instant.',
    unconfigured: 'L’assistant n’est pas encore activé. Revenez bientôt.'
  },
  en: {
    title: 'Ask AKAL',
    hint: 'Ask a question about a people. Answers draw only on the site’s validated fact sheets.',
    placeholder: 'e.g. Why do the Tuareg wear the veil?',
    examples: ['Where do the Sámi live?', 'What language do the Maasai speak?', 'Who are the Quechua?'],
    ask: 'Ask',
    asking: 'Searching…',
    disclaimer:
      'Answer generated from the site’s fact sheets. Check the sources on the relevant people’s page.',
    error: 'Something went wrong. Please try again shortly.',
    unconfigured: 'The assistant is not enabled yet. Please check back soon.'
  },
  es: {
    title: 'Pregunte a AKAL',
    hint: 'Haga una pregunta sobre un pueblo. Las respuestas se basan solo en las fichas validadas del sitio.',
    placeholder: 'Ej. ¿Por qué los tuareg llevan velo?',
    examples: ['¿Dónde viven los Sámi?', '¿Qué lengua hablan los Maasai?', '¿Quiénes son los Quechua?'],
    ask: 'Preguntar',
    asking: 'Buscando…',
    disclaimer:
      'Respuesta generada a partir de las fichas del sitio. Verifique las fuentes en la ficha del pueblo correspondiente.',
    error: 'Se produjo un error. Vuelva a intentarlo en un momento.',
    unconfigured: 'El asistente aún no está activado. Vuelva pronto.'
  }
};

export default function AskAkal({locale}: {locale: string}) {
  const t = T[(['en', 'fr', 'es'].includes(locale) ? locale : 'en') as L];
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
      if (res.status === 503) {
        setError(t.unconfigured);
      } else if (!res.ok) {
        setError(t.error);
      } else {
        const data = await res.json();
        setAnswer(data.answer || t.error);
      }
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-[42px] rounded-md border border-ligne bg-white p-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo text-[18px] text-or">
          ⴰ
        </span>
        <h2 className="font-serif text-[22px] font-semibold text-indigo">{t.title}</h2>
      </div>
      <p className="mt-1.5 text-[14px] text-gris">{t.hint}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(question);
        }}
        className="mt-4 flex flex-col gap-2 sm:flex-row"
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
          className="min-w-0 flex-1 rounded-md border border-ligne px-3.5 py-2.5 text-[14.5px] outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15"
        />
        <button
          type="submit"
          disabled={loading || question.trim().length < 3}
          className="rounded-md bg-laterite px-5 py-2.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-[#9E501B] disabled:opacity-60"
        >
          {loading ? t.asking : t.ask}
        </button>
      </form>

      {!answer && !loading && !error && (
        <div className="mt-3 flex flex-wrap gap-2">
          {t.examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setQuestion(ex);
                submit(ex);
              }}
              className="rounded-full border border-ligne px-3 py-1 text-[12.5px] text-indigo hover:border-indigo hover:bg-sable-2"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-md border-l-4 border-laterite bg-[#F6E7DA] px-4 py-3 text-[14px] text-[#6B4A22]">
          {error}
        </p>
      )}

      {answer && (
        <div className="mt-4">
          <div className="whitespace-pre-wrap rounded-md border border-ligne bg-sable px-4 py-3.5 text-[15px] leading-relaxed text-encre">
            {answer}
          </div>
          <p className="mt-2 flex gap-2 text-[12px] text-gris">
            <span aria-hidden>◈</span>
            {t.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
