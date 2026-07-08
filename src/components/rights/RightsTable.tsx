import type {Instrument} from '@/lib/types';
import {localize} from '@/lib/localize';

/** Legal-instruments table (prototype `.rtable`). */
export default function RightsTable({
  instruments,
  locale,
  labels
}: {
  instruments: Instrument[];
  locale: string;
  labels: {
    instrument: string;
    scope: string;
    nature: string;
    binding: string;
    declarative: string;
  };
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-ligne bg-white text-[14px]">
        <thead>
          <tr>
            {[labels.instrument, labels.scope, labels.nature].map((h) => (
              <th
                key={h}
                className="bg-indigo px-4 py-3 text-left text-[12px] uppercase tracking-[0.08em] text-white"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {instruments.map((it, i) => (
            <tr key={i}>
              <td className="border-b border-ligne px-4 py-3 align-top">
                <b className="text-indigo">{localize(it.name, locale)}</b>
              </td>
              <td className="border-b border-ligne px-4 py-3 align-top">
                {localize(it.scope, locale)}
              </td>
              <td className="border-b border-ligne px-4 py-3 align-top">
                <span
                  className={`whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11px] font-semibold ${
                    it.binding
                      ? 'bg-[#E3EBE6] text-ok'
                      : 'bg-[#E4E7F2] text-indigo'
                  }`}
                >
                  {it.binding ? labels.binding : labels.declarative}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
