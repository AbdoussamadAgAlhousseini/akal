import Link from 'next/link';
import {getAdminRequests} from '@/lib/admin-data';
import {getTaxonomies} from '@/lib/content';
import {localize} from '@/lib/localize';
import {deleteRequest, setRequestStatus} from '../../actions';
import {Card, btnGhost} from '../../ui';

const STATUS: Record<string, string> = {
  pending: 'En attente',
  reviewed: 'Examinée',
  approved: 'Approuvée',
  rejected: 'Rejetée'
};

export default async function RequestsAdmin() {
  const requests = await getAdminRequests();
  const tax = getTaxonomies();

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-[26px] font-semibold text-indigo">
        Demandes d'adhésion
      </h1>
      <p className="text-[13px] text-gris">
        Après approbation, ajoutez l'organisation dans l'onglet{' '}
        <Link href="/admin/organizations" className="font-semibold text-laterite">
          Organisations
        </Link>{' '}
        pour la publier sur le site.
      </p>

      {requests.length === 0 && (
        <Card>
          <p className="text-gris">Aucune demande pour l'instant.</p>
        </Card>
      )}

      {requests.map((r) => (
        <Card key={r.id}>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="font-serif text-[18px] font-semibold text-indigo">
              {r.organization}
            </span>
            <span className="rounded-full bg-sable-2 px-2.5 py-0.5 text-[11.5px] font-bold text-indigo">
              {STATUS[r.status] ?? r.status}
            </span>
          </div>
          <div className="grid gap-1 text-[14px] text-encre sm:grid-cols-2">
            <div>
              <b className="text-gris">E-mail : </b>
              <a href={`mailto:${r.email}`} className="text-laterite">
                {r.email}
              </a>
            </div>
            <div>
              <b className="text-gris">Pays : </b>
              {r.country || '—'}
            </div>
            <div>
              <b className="text-gris">Catégorie : </b>
              {localize(tax.categories[r.category] ?? {en: r.category, fr: r.category, es: r.category}, 'fr')}
            </div>
            <div>
              <b className="text-gris">Reçue le : </b>
              {new Date(r.created_at).toLocaleDateString('fr-FR')}
            </div>
          </div>
          {r.message && (
            <p className="mt-2 rounded bg-sable px-3 py-2 text-[14px] text-encre">
              {r.message}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(['reviewed', 'approved', 'rejected'] as const).map((st) => (
              <form key={st} action={setRequestStatus}>
                <input type="hidden" name="id" defaultValue={r.id} />
                <input type="hidden" name="status" defaultValue={st} />
                <button className={btnGhost}>Marquer {STATUS[st].toLowerCase()}</button>
              </form>
            ))}
            <form action={deleteRequest}>
              <input type="hidden" name="id" defaultValue={r.id} />
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
