/** Section page heading: eyebrow + serif title + lead (prototype `.pagehead`). */
export default function PageHead({
  eyebrow,
  title,
  lead
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <>
      <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[0.18em] text-laterite">
        {eyebrow}
      </p>
      <h1 className="mb-2 font-serif text-[34px] font-semibold leading-[1.2] text-indigo">
        {title}
      </h1>
      <p className="mb-8 max-w-[760px] text-[17px] text-gris">{lead}</p>
    </>
  );
}
