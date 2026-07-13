import Link from 'next/link';
import {getAdminNews} from '@/lib/admin-data';
import {deleteNews, saveNews} from '../../actions';
import {Card, Field, PageTitle, StatusBadge, TriField, btn, btnDanger, btnGhost} from '../../ui';

export default async function NewsAdmin({
  searchParams
}: {
  searchParams: Promise<{edit?: string}>;
}) {
  const {edit} = await searchParams;
  const news = await getAdminNews();
  const editing = edit ? (news.find((n) => n.id === edit) ?? null) : null;

  return (
    <div className="flex flex-col gap-5">
      <PageTitle hint="Ajoutez, modifiez ou dépubliez les actualités.">
        Actualités
      </PageTitle>

      <Card title={editing ? 'Modifier une actualité' : 'Ajouter une actualité'}>
        <form action={saveNews} className="flex flex-col gap-3">
          {editing && <input type="hidden" name="id" defaultValue={editing.id} />}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field name="day" labelText="Jour (ex. 02)" defaultValue={editing?.day} />
            <Field
              name="sort"
              labelText="Ordre"
              type="number"
              defaultValue={String(editing?.sort ?? news.length)}
            />
          </div>
          <TriField base="month" labelText="Mois (ex. JUIL / JUL)" value={editing?.month} />
          <TriField base="source" labelText="Source" value={editing?.source} />
          <TriField base="title" labelText="Titre" value={editing?.title} textarea />
          <TriField base="body" labelText="Texte" value={editing?.body} textarea />
          <label className="flex items-center gap-2 text-[14px]">
            <input
              type="checkbox"
              name="published"
              defaultChecked={editing ? editing.published : true}
            />
            Publiée (visible sur le site)
          </label>
          <div className="flex gap-2">
            <button type="submit" className={btn}>
              {editing ? 'Enregistrer' : 'Ajouter'}
            </button>
            {editing && (
              <Link href="/abdoussamad/news" className={btnGhost}>
                Annuler
              </Link>
            )}
          </div>
        </form>
      </Card>

      <Card title={`Liste (${news.length})`}>
        <div className="flex flex-col divide-y divide-ligne">
          {news.map((n) => (
            <div key={n.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
              <span className="min-w-[200px] flex-1 font-semibold text-indigo">
                {n.title?.fr || n.title?.en}
              </span>
              {!n.published && <StatusBadge label="Brouillon" tone="warn" />}
              <div className="flex gap-1.5">
                <Link href={`/abdoussamad/news?edit=${n.id}`} className={btnGhost}>
                  Modifier
                </Link>
                <form action={deleteNews}>
                  <input type="hidden" name="id" defaultValue={n.id} />
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
