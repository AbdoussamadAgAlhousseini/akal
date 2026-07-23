import Link from 'next/link';
import {getAdminOpps} from '@/lib/admin-data';
import {deleteOpp, saveOpp} from '../../actions';
import {Card, Field, PageTitle, StatusBadge, TriField, btn, btnDanger, btnGhost} from '../../ui';

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
      <PageTitle hint="Ajoutez, modifiez ou dépubliez les opportunités.">
        Opportunités
      </PageTitle>

      <Card title={editing ? 'Modifier une opportunité' : 'Ajouter une opportunité'}>
        <form key={editing?.id ?? 'new'} action={saveOpp} className="flex flex-col gap-3">
          {editing && <input type="hidden" name="id" defaultValue={editing.id} />}
          <TriField base="title" labelText="Titre" value={editing?.title} textarea />
          <TriField base="body" labelText="Description" value={editing?.body} textarea />
          <TriField
            base="deadline"
            labelText="Échéance (ex. Au fil de l'eau)"
            value={editing?.deadline}
          />
          <Field
            name="link"
            labelText="Lien de l'annonce officielle (facultatif)"
            defaultValue={editing?.link ?? ''}
            placeholder="https://…"
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
              <Link href="/abdoussamad/opportunities" className={btnGhost}>
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
              {!o.published && <StatusBadge label="Brouillon" tone="warn" />}
              <div className="flex gap-1.5">
                <Link href={`/abdoussamad/opportunities?edit=${o.id}`} className={btnGhost}>
                  Modifier
                </Link>
                <form action={deleteOpp}>
                  <input type="hidden" name="id" defaultValue={o.id} />
                  <button className={btnDanger}>Supprimer</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
