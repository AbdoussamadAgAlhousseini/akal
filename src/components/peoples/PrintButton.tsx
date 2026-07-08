'use client';

/** Print / PDF button for a fact sheet (uses the browser print dialog). */
export default function PrintButton({label}: {label: string}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded border border-ligne bg-white px-4 py-2 text-[13px] font-semibold text-indigo hover:border-indigo"
    >
      {label}
    </button>
  );
}
