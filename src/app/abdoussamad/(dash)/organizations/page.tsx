import Link from 'next/link';
import {getAdminOrgs} from '@/lib/admin-data';
import {getTaxonomies} from '@/lib/content';
import {localize} from '@/lib/localize';
import {deleteOrg, saveOrg, setOrgStatus} from '../../actions';
import {
  Card,
  Field,
  PageTitle,
  Select,
  StatusBadge,
  TriField,
  btn,
  btnDanger,
  btnGhost
} from '../../ui';

const STATUS_LABEL: Record<string, string> = {
  approved: 'Approuvée',
  pending: 'En attente',
  rejected: 'Rejetée'
};

export default async function OrgAdmin({
  searchParams
}: {
  searchParams: Promise<{edit?: string}>;
}) {
  const {edit} = await searchParams;
  const orgs = await getAdminOrgs();
  const editing = edit ? (orgs.find((o) => o.id === edit) ?? null) : null;

  const tax = getTaxonomies();
  const catOpts = Object.entries(tax.categories)
    .filter(([k]) => k !== 'all')
    .map(([value, l]) => ({value, label: localize(l, 'fr')}));
  const countryOpts = Object.entries(tax.countries)
    .filter(([k]) => k !== 'all')
    .map(([value, l]) => ({value, label: localize(l, 'fr')}));
  const statusOpts = [
    {value: 'approved', label: 'Approuvée (visible sur le site)'},
    {value: 'pending', label: 'En attente (cachée)'},
    {value: 'rejected', label: 'Rejetée'}
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageTitle hint="Ajoutez, modifiez, approuvez ou masquez les organisations de l'annuaire.">
        Organisations
      </PageTitle>

      <Card title={editing ? `Modifier — ${editing.name}` : 'Ajouter une organisation'}>
        <form key={editing?.id ?? 'new'} action={saveOrg} className="flex flex-col gap-3">
          {editing && <input type="hidden" name="id" defaultValue={editing.id} />}
          <Field name="name" labelText="Nom" defaultValue={editing?.name} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Select
              name="category"
              labelText="Catégorie"
              options={catOpts}
              defaultValue={editing?.category}
            />
            <Select
              name="country"
              labelText="Pays"
              options={countryOpts}
              defaultValue={editing?.country}
            />
          </div>
          <TriField base="mission" labelText="Mission" value={editing?.mission} textarea />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field name="url" labelText="Site web" defaultValue={editing?.url ?? ''} placeholder="https://…" />
            <Field name="email" labelText="E-mail public" defaultValue={editing?.email ?? ''} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Select
              name="status"
              labelText="Statut"
              options={statusOpts}
              defaultValue={editing?.status ?? 'approved'}
            />
            <Field
              name="sort"
              labelText="Ordre d'affichage"
              type="number"
              defaultValue={String(editing?.sort ?? orgs.length)}
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className={btn}>
              {editing ? 'Enregistrer' : 'Ajouter'}
            </button>
            {editing && (
              <Link href="/abdoussamad/organizations" className={btnGhost}>
                Annuler
              </Link>
            )}
          </div>
        </form>
      </Card>

      <Card title={`Liste (${orgs.length})`}>
        <div className="flex flex-col divide-y divide-ligne">
          {orgs.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
              <span className="min-w-[160px] flex-1 font-semibold text-indigo">
                {o.name}
              </span>
              <StatusBadge
                label={STATUS_LABEL[o.status] ?? o.status}
                tone={
                  o.status === 'approved'
                    ? 'ok'
                    : o.status === 'rejected'
                      ? 'bad'
                      : 'warn'
                }
              />
              <div className="flex flex-wrap gap-1.5">
                <Link href={`/abdoussamad/organizations?edit=${o.id}`} className={btnGhost}>
                  Modifier
                </Link>
                {o.status !== 'approved' && (
                  <form action={setOrgStatus}>
                    <input type="hidden" name="id" defaultValue={o.id} />
                    <input type="hidden" name="status" defaultValue="approved" />
                    <button className={btnGhost}>Approuver</button>
                  </form>
                )}
                {o.status === 'approved' && (
                  <form action={setOrgStatus}>
                    <input type="hidden" name="id" defaultValue={o.id} />
                    <input type="hidden" name="status" defaultValue="pending" />
                    <button className={btnGhost}>Cacher</button>
                  </form>
                )}
                <form action={deleteOrg}>
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
