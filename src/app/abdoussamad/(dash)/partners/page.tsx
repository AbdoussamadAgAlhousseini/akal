import Link from 'next/link';
import {getAdminPartners} from '@/lib/admin-data';
import {deletePartner, savePartner, seedInitialPartners} from '../../actions';
import {Card, Field, PageTitle, StatusBadge, btn, btnDanger, btnGhost} from '../../ui';

export default async function PartnersAdmin({
  searchParams
}: {
  searchParams: Promise<{edit?: string}>;
}) {
  const {edit} = await searchParams;
  const partners = await getAdminPartners();
  const e = edit ? (partners.find((p) => p.id === edit) ?? null) : null;

  return (
    <div className="flex flex-col gap-5">
      <PageTitle hint="Les partenaires et leurs logos défilent sur la page d'accueil.">
        Partenaires
      </PageTitle>

      {partners.length === 0 && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[14px] text-gris">
              Aucun partenaire pour l'instant. Importez la liste de départ, puis
              ajoutez les logos.
            </p>
            <form action={seedInitialPartners}>
              <button className={btn}>Importer les partenaires de base</button>
            </form>
          </div>
        </Card>
      )}

      <Card title={e ? `Modifier — ${e.name}` : 'Ajouter un partenaire'}>
        <form action={savePartner} className="flex flex-col gap-3">
          {e && <input type="hidden" name="id" defaultValue={e.id} />}
          <Field name="name" labelText="Nom du partenaire" defaultValue={e?.name} />
          <Field
            name="url"
            labelText="Site web (facultatif)"
            defaultValue={e?.url ?? ''}
            placeholder="https://…"
          />
          <Field
            name="logo"
            labelText="URL du logo (facultatif — collez le lien d'une image)"
            defaultValue={e?.logo ?? ''}
            placeholder="https://…/logo.png"
          />
          {e?.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={e.logo}
              alt={e.name}
              className="h-9 w-auto rounded border border-ligne bg-white p-1"
            />
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              name="sort"
              labelText="Ordre"
              type="number"
              defaultValue={String(e?.sort ?? partners.length)}
            />
            <label className="mt-6 flex items-center gap-2 text-[14px]">
              <input
                type="checkbox"
                name="published"
                defaultChecked={e ? e.published : true}
              />
              Visible sur le site
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className={btn}>
              {e ? 'Enregistrer' : 'Ajouter'}
            </button>
            {e && (
              <Link href="/abdoussamad/partners" className={btnGhost}>
                Annuler
              </Link>
            )}
          </div>
        </form>
      </Card>

      <Card title={`Liste (${partners.length})`}>
        <div className="flex flex-col divide-y divide-ligne">
          {partners.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
              {p.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.logo} alt={p.name} className="h-6 w-auto" />
              ) : null}
              <span className="min-w-[160px] flex-1 font-semibold text-indigo">
                {p.name}
              </span>
              {!p.published && <StatusBadge label="Masqué" tone="warn" />}
              <div className="flex gap-1.5">
                <Link href={`/abdoussamad/partners?edit=${p.id}`} className={btnGhost}>
                  Modifier
                </Link>
                <form action={deletePartner}>
                  <input type="hidden" name="id" defaultValue={p.id} />
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
