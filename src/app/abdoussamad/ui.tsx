import type {ReactNode} from 'react';

const input =
  'w-full rounded-md border border-ligne bg-white px-3 py-2 text-[14px] outline-none transition-colors focus:border-indigo focus:ring-2 focus:ring-indigo/15';
const label =
  'mb-1 block text-[11px] font-bold uppercase tracking-[0.07em] text-gris';

export function Field({
  name,
  labelText,
  defaultValue = '',
  type = 'text',
  placeholder
}: {
  name: string;
  labelText: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={label} htmlFor={name}>
        {labelText}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={input}
      />
    </div>
  );
}

/** Three inputs (FR / EN / ES) that submit as `${base}_fr`, `${base}_en`, `${base}_es`. */
export function TriField({
  base,
  labelText,
  value,
  textarea = false
}: {
  base: string;
  labelText: string;
  value?: {en?: string; fr?: string; es?: string};
  textarea?: boolean;
}) {
  const langs: {code: 'fr' | 'en' | 'es'; name: string}[] = [
    {code: 'fr', name: 'FR'},
    {code: 'en', name: 'EN'},
    {code: 'es', name: 'ES'}
  ];
  return (
    <fieldset className="rounded-md border border-ligne bg-sable/40 p-3">
      <legend className="px-1.5 text-[11px] font-bold uppercase tracking-[0.07em] text-laterite">
        {labelText}
      </legend>
      <div className="flex flex-col gap-2">
        {langs.map((l) => (
          <label key={l.code} className="flex items-start gap-2">
            <span className="mt-2 w-8 shrink-0 text-[11px] font-bold text-gris">
              {l.name}
            </span>
            {textarea ? (
              <textarea
                name={`${base}_${l.code}`}
                defaultValue={value?.[l.code] ?? ''}
                rows={2}
                className={`${input} resize-y`}
              />
            ) : (
              <input
                name={`${base}_${l.code}`}
                defaultValue={value?.[l.code] ?? ''}
                className={input}
              />
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Select({
  name,
  labelText,
  options,
  defaultValue
}: {
  name: string;
  labelText: string;
  options: {value: string; label: string}[];
  defaultValue?: string;
}) {
  return (
    <div>
      <label className={label} htmlFor={name}>
        {labelText}
      </label>
      <select id={name} name={name} defaultValue={defaultValue} className={input}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Card({
  title,
  action,
  children
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-ligne bg-white shadow-[0_1px_2px_rgba(20,28,66,0.05)]">
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-ligne px-5 py-3.5">
          <h2 className="font-serif text-[17px] font-semibold text-indigo">
            {title}
          </h2>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function PageTitle({
  children,
  hint
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <h1 className="font-serif text-[27px] font-semibold text-indigo">
        {children}
      </h1>
      {hint && <p className="mt-1 text-[13.5px] text-gris">{hint}</p>}
    </div>
  );
}

export function StatusBadge({
  label: text,
  tone
}: {
  label: string;
  tone: 'ok' | 'warn' | 'bad' | 'neutral' | 'accent';
}) {
  const tones: Record<string, string> = {
    ok: 'bg-[#E3EBE6] text-ok',
    warn: 'bg-sable-2 text-gris',
    bad: 'bg-[#F6E0DA] text-[#8A3A22]',
    neutral: 'bg-sable-2 text-indigo',
    accent: 'bg-laterite-soft text-laterite'
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tones[tone]}`}
    >
      {text}
    </span>
  );
}

export const btn =
  'inline-flex items-center gap-1.5 rounded-md bg-laterite px-4 py-2 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#9E501B] disabled:opacity-60';
export const btnGhost =
  'inline-flex items-center rounded-md border border-ligne bg-white px-3 py-1.5 text-[13px] font-semibold text-indigo transition-colors hover:border-indigo hover:bg-sable';
export const btnDanger =
  'inline-flex items-center rounded-md border border-[#E7C4B8] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#8A3A22] transition-colors hover:border-[#8A3A22] hover:bg-[#FBF1EE]';
