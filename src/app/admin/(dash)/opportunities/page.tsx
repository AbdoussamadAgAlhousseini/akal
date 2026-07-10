import Link from 'next/link';
import {getAdminOpps} from '@/lib/admin-data';
import {deleteOpp, saveOpp} from '../../actions';
import {Card, Field, TriField, btn, btnGhost} from '../../ui';

export default async function OppAdmin({
  searchParams
}: {
  searchParams: Promise<{edit?: string}>;
}) {
  const {edit} = await searchParams;
  const opps = await getAdminOpps();
  const editing = edit ? (opps.find((o) => o.id === edit) ?? null) : null;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-[26px] font-semibold text-indigo">
        Opportunités
      </h1>

      <Card title={editing ? 'Modifier une opportunité' : 'Ajouter une opportunité'}>
        <form action={saveOpp} className="flex flex-col gap-3">
          {editing && <input type="hidden" name="id" defaultValue={editing.id} />}
          <TriField base="title" labelText="Titre" value={editing?.title} textarea />
          <TriField base="body" labelText="Description" value={editing?.body} textarea />
          <TriField
            base="deadline"
            labelText="Échéance (ex. Au fil de l'eau)"
            value={editing?.deadline}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              name="sort"
              labelText="Ordre"
              type="number"
              defaultValue={String(editing?.sort ?? opps.length)}
            />
            <label className="mt-6 flex items-center gap-2 text-[14px]">
              <input
                type="checkbox"
                name="published"
                defaultChecked={editing ? editing.published : true}
              />
              Publiée (visible sur le site)
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className={btn}>
              {editing ? 'Enregistrer' : 'Ajouter'}
            </button>
            {editing && (
              <Link href="/admin/opportunities" className={btnGhost}>
                Annuler
              </Link>
            )}
          </div>
        </form>
      </Card>

      <Card title={`Liste (${opps.length})`}>
        <div className="flex flex-col divide-y divide-ligne">
          {opps.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
              <span className="min-w-[200px] flex-1 font-semibold text-indigo">
                {o.title?.fr || o.title?.en}
              </span>
              {!o.published && (
                <span className="rounded-full bg-sable-2 px-2 py-0.5 text-[11px] font-bold text-gris">
                  Brouillon
                </span>
              )}
              <div className="flex gap-1.5">
                <Link href={`/admin/opportunities?edit=${o.id}`} className={btnGhost}>
                  Modifier
                </Link>
                <form action={deleteOpp}>
                  <input type="hidden" name="id" defaultValue={o.id} />
                  <button className="rounded border border-[#E7C4B8] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#8A3A22] hover:border-[#8A3A22]">
                    Supprimer
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
