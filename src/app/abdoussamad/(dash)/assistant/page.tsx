import {getAdminAssistantLogs} from '@/lib/admin-data';
import {clearAssistantLogs, deleteAssistantLog} from '../../actions';
import {Card, PageTitle, StatusBadge, btnDanger, btnGhost} from '../../ui';

const LOCALE_LABEL: Record<string, string> = {fr: 'FR', en: 'EN', es: 'ES'};

function when(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default async function AssistantAdmin() {
  const logs = await getAdminAssistantLogs();

  return (
    <div className="flex flex-col gap-5">
      <PageTitle hint="Les questions posées à l'assistant « Demandez à AKAL » et ses réponses. Utile pour comprendre ton public et repérer les contenus à ajouter.">
        Assistant IA
      </PageTitle>

      <Card
        title={`Questions reçues (${logs.length})`}
      >
        {logs.length === 0 ? (
          <p className="text-[14px] text-gris">
            Aucune question pour l'instant. Elles apparaîtront ici dès que des
            visiteurs utiliseront l'assistant sur le site.
          </p>
        ) : (
          <>
            <div className="mb-4 flex justify-end">
              <form action={clearAssistantLogs}>
                <button className={btnDanger}>Tout effacer</button>
              </form>
            </div>
            <div className="flex flex-col divide-y divide-ligne">
              {logs.map((l) => (
                <div key={l.id} className="flex flex-col gap-1.5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge
                      label={l.locale ? (LOCALE_LABEL[l.locale] ?? l.locale) : '—'}
                      tone="ok"
                    />
                    <span className="text-[12px] text-gris">{when(l.created_at)}</span>
                    <form action={deleteAssistantLog} className="ml-auto">
                      <input type="hidden" name="id" defaultValue={l.id} />
                      <button className={btnGhost}>Supprimer</button>
                    </form>
                  </div>
                  <p className="font-semibold text-indigo">{l.question}</p>
                  <p className="whitespace-pre-wrap text-[14px] text-gris">{l.answer}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
