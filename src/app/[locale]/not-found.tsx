import Link from 'next/link';
import Container from '@/components/common/Container';

/**
 * Localized 404. Rendered inside the [locale] layout, so it keeps the site
 * header and footer. Labels stay language-neutral (EN · FR · ES).
 */
export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-indigo text-white">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-0 select-none font-serif text-[38vw] leading-none text-white/[0.05] md:text-[280px]"
      >
        ⴰ
      </span>
      <Container>
        <div className="flex min-h-[62vh] flex-col items-center justify-center py-24 text-center">
          <p className="relative mb-3 text-[12px] font-bold uppercase tracking-[0.2em] text-or">
            Erreur 404
          </p>
          <h1 className="relative font-serif text-[clamp(60px,14vw,130px)] font-semibold leading-none">
            404
          </h1>
          <p className="relative mt-4 max-w-[440px] text-[16px] text-[#C9CEE6]">
            Page introuvable · Page not found · Página no encontrada
          </p>
          <Link
            href="/"
            className="relative mt-8 rounded bg-laterite px-6 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-[#9E501B]"
          >
            Accueil · Home · Inicio →
          </Link>
        </div>
      </Container>
    </section>
  );
}
