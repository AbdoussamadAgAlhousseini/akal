import {getAdminContributions} from '@/lib/admin-data';
import {deleteContribution, setContributionStatus} from '../../actions';
import {Card, btnGhost} from '../../ui';

const TYPE: Record<string, string> = {
  correction: 'Correction',
  fact_sheet: 'Proposition de fiche',
  translation: 'Traduction',
  organization: 'Organisation',
  other: 'Autre'
};

const STATUS: Record<string, string> = {
  new: 'Nouvelle',
  reviewed: 'Examinée',
  done: 'Traitée'
};

export default async function ContributionsAdmin() {
  const items = await getAdminContributions();

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-[26px] font-semibold text-indigo">
        Contributions
      </h1>

      {items.length === 0 && (
        <Card>
          <p className="text-gris">Aucune contribution pour l'instant.</p>
        </Card>
      )}

      {items.map((c) => (
        <Card key={c.id}>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="font-serif text-[18px] font-semibold text-indigo">
              {c.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-laterite-soft px-2.5 py-0.5 text-[11.5px] font-bold text-laterite">
                {TYPE[c.type] ?? c.type}
              </span>
              <span className="rounded-full bg-sable-2 px-2.5 py-0.5 text-[11.5px] font-bold text-indigo">
                {STATUS[c.status] ?? c.status}
              </span>
            </div>
          </div>
          <div className="text-[14px] text-encre">
            <b className="text-gris">E-mail : </b>
            <a href={`mailto:${c.email}`} className="text-laterite">
              {c.email}
            </a>
            <span className="ml-3 text-gris">
              {new Date(c.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <p className="mt-2 whitespace-pre-line rounded bg-sable px-3 py-2 text-[14px] text-encre">
            {c.message}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(['reviewed', 'done'] as const).map((st) => (
              <form key={st} action={setContributionStatus}>
                <input type="hidden" name="id" defaultValue={c.id} />
                <input type="hidden" name="status" defaultValue={st} />
                <button className={btnGhost}>Marquer {STATUS[st].toLowerCase()}</button>
              </form>
            ))}
            <form action={deleteContribution}>
              <input type="hidden" name="id" defaultValue={c.id} />
              <button className="rounded border border-[#E7C4B8] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#8A3A22] hover:border-[#8A3A22]">
                Supprimer
              </button>
            </form>
          </div>
        </Card>
      ))}
    </div>
  );
}
