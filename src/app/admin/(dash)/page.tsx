import Link from 'next/link';
import {
  getAdminContributions,
  getAdminNews,
  getAdminOpps,
  getAdminOrgs,
  getAdminRequests,
  getAdminSubscribers
} from '@/lib/admin-data';
import {PageTitle} from '../ui';

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
    {label: 'Organisations', value: orgs.length, href: '/admin/organizations', accent: false},
    {label: 'Actualités', value: news.length, href: '/admin/news', accent: false},
    {label: 'Opportunités', value: opps.length, href: '/admin/opportunities', accent: false},
    {label: 'Inscrits newsletter', value: subs.length, href: '/admin/subscribers', accent: false}
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageTitle hint="Vue d'ensemble. Les nouveautés à traiter sont mises en avant.">
        Tableau de bord
      </PageTitle>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(210px,100%),1fr))]">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group relative overflow-hidden rounded-lg border border-ligne bg-white shadow-[0_1px_2px_rgba(20,28,66,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(31,42,94,0.10)]"
          >
            <span
              className={`absolute inset-x-0 top-0 h-1 ${
                s.accent ? 'bg-laterite' : 'bg-indigo/70'
              }`}
            />
            <div className="p-5">
              <div
                className={`font-serif text-[34px] font-semibold leading-none ${
                  s.accent ? 'text-laterite' : 'text-indigo'
                }`}
              >
                {s.value}
              </div>
              <div className="mt-2 text-[12.5px] uppercase tracking-[0.04em] text-gris">
                {s.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-[13px] text-gris">
        Astuce : toute modification apparaît sur le site public en quelques
        secondes.
      </p>
    </div>
  );
}
