import Link from 'next/link';
import {redirect} from 'next/navigation';
import {isAuthed} from '@/lib/admin-auth';
import {logout} from '../actions';
import AdminNav from './AdminNav';

export default function DashLayout({children}: {children: React.ReactNode}) {
  if (!isAuthed()) redirect('/admin/login');

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-indigo-deep bg-indigo text-white shadow-[0_2px_12px_rgba(20,28,66,0.25)]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded border border-white/40 font-serif text-[16px] text-or">
              ⴰ
            </span>
            <span className="font-serif text-[17px] font-semibold">
              AKAL{' '}
              <span className="text-[13px] font-normal text-[#C9CEE6]">
                · Administration
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <Link
              href="/fr"
              target="_blank"
              className="text-[#C9CEE6] hover:text-white"
            >
              Voir le site ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded border border-white/35 px-3 py-1.5 font-semibold text-white hover:border-white"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-6 md:flex-row">
        <aside className="shrink-0 md:w-56">
          <AdminNav />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
