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
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="rounded-md border border-ligne bg-white p-8">
        <div className="mb-1 font-serif text-[26px] font-semibold text-indigo">
          AKAL · Administration
        </div>
        <p className="mb-6 text-sm text-gris">
          Espace réservé. Entrez le mot de passe d'administration.
        </p>
        <form action={login} className="flex flex-col gap-3">
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Mot de passe"
            className="w-full rounded border border-ligne px-3 py-2.5 text-[15px]"
          />
          <button
            type="submit"
            className="rounded bg-laterite px-5 py-2.5 font-semibold text-white hover:bg-[#9E501B]"
          >
            Se connecter
          </button>
        </form>
        {error && (
          <p className="mt-3 rounded bg-[#F6E0DA] px-3 py-2 text-[13.5px] font-semibold text-[#8A3A22]">
            Mot de passe incorrect.
          </p>
        )}
      </div>
    </main>
  );
}
