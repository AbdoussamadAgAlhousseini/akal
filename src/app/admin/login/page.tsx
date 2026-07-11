import {redirect} from 'next/navigation';
import {isAuthed} from '@/lib/admin-auth';
import {login} from '../actions';

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{error?: string}>;
}) {
  if (isAuthed()) redirect('/admin');
  const {error} = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <div className="overflow-hidden rounded-xl border border-ligne bg-white shadow-[0_10px_40px_rgba(20,28,66,0.12)]">
        <div className="flex items-center gap-3 bg-indigo px-7 py-6 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded border border-white/40 font-serif text-[20px] text-or">
            ⴰ
          </span>
          <div>
            <div className="font-serif text-[20px] font-semibold">AKAL</div>
            <div className="text-[12px] uppercase tracking-[0.13em] text-[#C9CEE6]">
              Administration
            </div>
          </div>
        </div>
        <div className="p-7">
          <p className="mb-5 text-[14px] text-gris">
            Espace réservé. Entrez le mot de passe d'administration.
          </p>
          <form action={login} className="flex flex-col gap-3">
            <input
              type="password"
              name="password"
              required
              autoFocus
              placeholder="Mot de passe"
              className="w-full rounded-md border border-ligne px-3 py-2.5 text-[15px] outline-none transition-colors focus:border-indigo focus:ring-2 focus:ring-indigo/15"
            />
            <button
              type="submit"
              className="rounded-md bg-laterite px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[#9E501B]"
            >
              Se connecter
            </button>
          </form>
          {error && (
            <p className="mt-4 rounded-md bg-[#F6E0DA] px-3 py-2 text-[13.5px] font-semibold text-[#8A3A22]">
              Mot de passe incorrect.
            </p>
          )}
        </div>
      </div>
      <p className="mt-4 text-center text-[12px] text-gris">
        AKAL · Plateforme des peuples autochtones
      </p>
    </main>
  );
}
