import Link from 'next/link';
import {redirect} from 'next/navigation';
import {isAuthed} from '@/lib/admin-auth';
import {logout} from '../actions';

const NAV = [
  {href: '/admin', label: 'Tableau de bord'},
  {href: '/admin/requests', label: "Demandes d'adhésion"},
  {href: '/admin/contributions', label: 'Contributions'},
  {href: '/admin/organizations', label: 'Organisations'},
  {href: '/admin/news', label: 'Actualités'},
  {href: '/admin/opportunities', label: 'Opportunités'},
  {href: '/admin/subscribers', label: 'Inscrits newsletter'}
];

export default function DashLayout({children}: {children: React.ReactNode}) {
  if (!isAuthed()) redirect('/admin/login');

  return (
    <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col gap-6 px-6 py-6 md:flex-row">
      <aside className="shrink-0 md:w-56">
        <div className="mb-4 font-serif text-[20px] font-semibold text-indigo">
          AKAL · Admin
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded px-3 py-2 text-[14px] text-encre hover:bg-sable-2"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="mt-4">
          <button
            type="submit"
            className="text-[13px] font-semibold text-laterite hover:underline"
          >
            Se déconnecter
          </button>
        </form>
        <p className="mt-6 text-[12px] text-gris">
          <Link href="/fr" className="hover:underline" target="_blank">
            Voir le site →
          </Link>
        </p>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
