import Link from 'next/link';
import {
  getAdminContributions,
  getAdminNews,
  getAdminOpps,
  getAdminOrgs,
  getAdminRequests,
  getAdminSubscribers
} from '@/lib/admin-data';
import {Card} from '../ui';

export default async function Dashboard() {
  const [orgs, news, opps, requests, subs, contribs] = await Promise.all([
    getAdminOrgs(),
    getAdminNews(),
    getAdminOpps(),
    getAdminRequests(),
    getAdminSubscribers(),
    getAdminContributions()
  ]);

  const pending = requests.filter((r) => r.status === 'pending').length;
  const newContribs = contribs.filter((c) => c.status === 'new').length;

  const stats = [
    {label: 'Demandes en attente', value: pending, href: '/admin/requests', accent: pending > 0},
    {label: 'Contributions nouvelles', value: newContribs, href: '/admin/contributions', accent: newContribs > 0},
    {label: 'Organisations', value: orgs.length, href: '/admin/organizations'},
    {label: 'Actualités', value: news.length, href: '/admin/news'},
    {label: 'Opportunités', value: opps.length, href: '/admin/opportunities'},
    {label: 'Inscrits newsletter', value: subs.length, href: '/admin/subscribers'}
  ];

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-[26px] font-semibold text-indigo">
        Tableau de bord
      </h1>
      <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(200px,100%),1fr))]">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card>
              <div
                className={`font-serif text-[32px] font-semibold ${
                  s.accent ? 'text-laterite' : 'text-indigo'
                }`}
              >
                {s.value}
              </div>
              <div className="text-[13px] text-gris">{s.label}</div>
            </Card>
          </Link>
        ))}
      </div>
      <p className="text-[13px] text-gris">
        Astuce : les modifications apparaissent sur le site public en quelques
        secondes.
      </p>
    </div>
  );
}
