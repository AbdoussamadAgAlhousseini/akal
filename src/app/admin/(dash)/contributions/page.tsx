import {getAdminContributions} from '@/lib/admin-data';
import {deleteContribution, setContributionStatus} from '../../actions';
import {Card, PageTitle, StatusBadge, btnDanger, btnGhost} from '../../ui';

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
      <PageTitle hint="Corrections, propositions de fiches, traductions et messages reçus.">
        Contributions
      </PageTitle>

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
              <StatusBadge label={TYPE[c.type] ?? c.type} tone="accent" />
              <StatusBadge
                label={STATUS[c.status] ?? c.status}
                tone={
                  c.status === 'done'
                    ? 'ok'
                    : c.status === 'reviewed'
                      ? 'neutral'
                      : 'warn'
                }
              />
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
              <button className={btnDanger}>Supprimer</button>
            </form>
          </div>
        </Card>
      ))}
    </div>
  );
}
