import Link from 'next/link';
import {getAdminPeoples} from '@/lib/admin-data';
import {getTaxonomies} from '@/lib/content';
import {localize} from '@/lib/localize';
import {deletePeople, savePeople, seedInitialPeoples} from '../../actions';
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

const VIS_LABEL: Record<string, string> = {
  public: 'Publique',
  restricted: 'Restreinte',
  community: 'Communauté',
  unpublished: 'Non publiée'
};

const check =
  'flex items-center gap-2 text-[14px] rounded-md border border-ligne bg-white px-3 py-2';

export default async function PeoplesAdmin({
  searchParams
}: {
  searchParams: Promise<{edit?: string}>;
}) {
  const {edit} = await searchParams;
  const peoples = await getAdminPeoples();
  const e = edit ? (peoples.find((p) => p.id === edit) ?? null) : null;

  const tax = getTaxonomies();
  const regionOpts = Object.entries(tax.regions).map(([value, l]) => ({
    value,
    label: localize(l, 'fr')
  }));
  const visOpts = Object.entries(VIS_LABEL).map(([value, label]) => ({value, label}));
  const recLabel = (k: string) => localize(tax.status[k], 'fr');
  const secVal = (key: 'identity' | 'livelihoods' | 'rights' | 'threats') => ({
    fr: e?.sections?.fr?.[key],
    en: e?.sections?.en?.[key],
    es: e?.sections?.es?.[key]
  });

  return (
    <div className="flex flex-col gap-5">
      <PageTitle hint="Fiches des peuples. Elles alimentent la page Peuples, la carte et le peuple à la une.">
        Peuples
      </PageTitle>

      {peoples.length === 0 && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[14px] text-gris">
              Aucun peuple pour l'instant. Importez les 8 fiches de base pour
              démarrer (Kel Tamasheq, Fulɓe, Amazigh, Maasai, San, Sámi, Quechua,
              Inuit).
            </p>
            <form action={seedInitialPeoples}>
              <button className={btn}>Importer les 8 peuples de base</button>
            </form>
          </div>
        </Card>
      )}

      <Card title={e ? `Modifier — ${e.name}` : 'Ajouter un peuple'}>
        {/* `key` forces a remount when switching records — without it React
            reuses the uncontrolled inputs and keeps the previous fiche's text. */}
        <form key={e?.id ?? 'new'} action={savePeople} className="flex flex-col gap-4">
          {e && <input type="hidden" name="id" defaultValue={e.id} />}

          <div className="grid gap-3 sm:grid-cols-3">
            <Field name="name" labelText="Nom d'usage" defaultValue={e?.name} />
            <Field name="endonym" labelText="Endonyme (natif)" defaultValue={e?.endonym} />
            <Field
              name="slug"
              labelText="Identifiant URL (slug)"
              defaultValue={e?.slug}
              placeholder="ex. kel-tamasheq"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Select name="region" labelText="Région" options={regionOpts} defaultValue={e?.region} />
            <Field name="population" labelText="Population (fourchette)" defaultValue={e?.population} placeholder="ex. 2,5 – 4 M" />
          </div>

          {/* Map */}
          <fieldset className="rounded-md border border-ligne p-3">
            <legend className="px-1.5 text-[11px] font-bold uppercase tracking-[0.07em] text-laterite">
              Carte (coordonnées volontairement approximatives)
            </legend>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field name="lat" labelText="Latitude" defaultValue={e ? String(e.lat) : ''} placeholder="ex. 19.5" />
              <Field name="lng" labelText="Longitude" defaultValue={e ? String(e.lng) : ''} placeholder="ex. 3.0" />
              <Field name="radius" labelText="Rayon (mètres)" type="number" defaultValue={String(e?.radius ?? 300000)} />
            </div>
            <label className={`${check} mt-3 w-fit`}>
              <input type="checkbox" name="pastoral" defaultChecked={e?.pastoral} /> Peuple pasteur
            </label>
          </fieldset>

          {/* Recognition */}
          <fieldset className="rounded-md border border-ligne p-3">
            <legend className="px-1.5 text-[11px] font-bold uppercase tracking-[0.07em] text-laterite">
              Reconnaissance (statuts multiples)
            </legend>
            <div className="flex flex-wrap gap-2">
              {['state', 'achpr', 'self'].map((r) => (
                <label key={r} className={check}>
                  <input
                    type="checkbox"
                    name={`rec_${r}`}
                    defaultChecked={e?.recognition.includes(r)}
                  />
                  {recLabel(r)}
                </label>
              ))}
            </div>
          </fieldset>

          <TriField base="countries" labelText="Pays" value={e?.countries} />
          <TriField base="language" labelText="Langue" value={e?.language} />
          <TriField base="summary" labelText="Résumé (carte & liste)" value={e?.summary} textarea />

          {/* Long sections (optional) */}
          <details className="rounded-md border border-ligne p-3" open={Boolean(e?.sections)}>
            <summary className="cursor-pointer text-[13px] font-bold uppercase tracking-[0.06em] text-laterite">
              Sections longues (facultatif — laissez vide pour une fiche courte)
            </summary>
            <div className="mt-3 flex flex-col gap-3">
              <TriField base="sec_identity" labelText="Identité & langue" value={secVal('identity')} textarea />
              <TriField base="sec_livelihoods" labelText="Mode de vie & économie" value={secVal('livelihoods')} textarea />
              <TriField base="sec_rights" labelText="Reconnaissance & droits" value={secVal('rights')} textarea />
              <TriField base="sec_threats" labelText="Menaces & résilience" value={secVal('threats')} textarea />
            </div>
          </details>

          {/* Publication */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Select name="visibility" labelText="Visibilité" options={visOpts} defaultValue={e?.visibility ?? 'public'} />
            <Field name="consent_status" labelText="Statut de consentement (CLPE/FPIC)" defaultValue={e?.consent_status ?? ''} />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.07em] text-gris">
              Sources (une par ligne)
            </label>
            <textarea
              name="sources"
              defaultValue={e?.sources.join('\n')}
              rows={3}
              className="w-full rounded-md border border-ligne bg-white px-3 py-2 text-[14px] outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/15"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field name="sort" labelText="Ordre d'affichage" type="number" defaultValue={String(e?.sort ?? peoples.length)} />
            <label className={`${check} mt-6 w-fit`}>
              <input type="checkbox" name="featured" defaultChecked={e?.featured} /> ⭐ Peuple à la une (accueil)
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className={btn}>
              {e ? 'Enregistrer' : 'Ajouter le peuple'}
            </button>
            {e && (
              <Link href="/abdoussamad/peoples" className={btnGhost}>
                Annuler
              </Link>
            )}
          </div>
        </form>
      </Card>

      <Card title={`Liste (${peoples.length})`}>
        <div className="flex flex-col divide-y divide-ligne">
          {peoples.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
              <span className="min-w-[160px] flex-1 font-semibold text-indigo">
                {p.featured && <span title="À la une">⭐ </span>}
                {p.name}{' '}
                <span className="font-serif text-or">{p.endonym}</span>
              </span>
              <StatusBadge
                label={VIS_LABEL[p.visibility] ?? p.visibility}
                tone={p.visibility === 'public' ? 'ok' : 'warn'}
              />
              <div className="flex gap-1.5">
                <Link href={`/abdoussamad/peoples?edit=${p.id}`} className={btnGhost}>
                  Modifier
                </Link>
                <form action={deletePeople}>
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
