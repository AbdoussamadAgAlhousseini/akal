import {getAdminSubscribers} from '@/lib/admin-data';
import {deleteSubscriber} from '../../actions';
import {Card} from '../../ui';

export default async function SubscribersAdmin() {
  const subs = await getAdminSubscribers();

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-[26px] font-semibold text-indigo">
        Inscrits newsletter
      </h1>

      <Card title={`Liste (${subs.length})`}>
        {subs.length === 0 ? (
          <p className="text-gris">Aucun inscrit pour l'instant.</p>
        ) : (
          <div className="flex flex-col divide-y divide-ligne">
            {subs.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5"
              >
                <a
                  href={`mailto:${s.email}`}
                  className="min-w-[200px] flex-1 font-semibold text-indigo"
                >
                  {s.email}
                </a>
                <span className="text-[12px] uppercase text-gris">
                  {s.locale ?? '—'}
                </span>
                <span className="text-[12px] text-gris">
                  {new Date(s.created_at).toLocaleDateString('fr-FR')}
                </span>
                <form action={deleteSubscriber}>
                  <input type="hidden" name="id" defaultValue={s.id} />
                  <button className="rounded border border-[#E7C4B8] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#8A3A22] hover:border-[#8A3A22]">
                    Supprimer
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
