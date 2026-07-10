import type {ReactNode} from 'react';

const input =
  'w-full rounded border border-ligne bg-white px-3 py-2 text-[14px]';
const label =
  'mb-1 block text-[11.5px] font-bold uppercase tracking-[0.06em] text-gris';

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
    {code: 'fr', name: 'Français'},
    {code: 'en', name: 'English'},
    {code: 'es', name: 'Español'}
  ];
  return (
    <fieldset className="rounded border border-ligne p-3">
      <legend className="px-1 text-[11.5px] font-bold uppercase tracking-[0.06em] text-laterite">
        {labelText}
      </legend>
      <div className="flex flex-col gap-2">
        {langs.map((l) => (
          <label key={l.code} className="flex items-start gap-2">
            <span className="mt-2 w-16 shrink-0 text-[11px] font-bold uppercase text-gris">
              {l.code}
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
  children
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border border-ligne bg-white p-5">
      {title && (
        <h2 className="mb-3 font-serif text-[18px] font-semibold text-indigo">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

export const btn =
  'rounded bg-laterite px-4 py-2 text-[13.5px] font-semibold text-white hover:bg-[#9E501B]';
export const btnGhost =
  'rounded border border-ligne bg-white px-3 py-1.5 text-[13px] font-semibold text-indigo hover:border-indigo';
