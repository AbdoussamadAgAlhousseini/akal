'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

const NAV = [
  {href: '/admin', label: 'Tableau de bord'},
  {href: '/admin/requests', label: "Demandes d'adhésion"},
  {href: '/admin/contributions', label: 'Contributions'},
  {href: '/admin/peoples', label: 'Peuples'},
  {href: '/admin/organizations', label: 'Organisations'},
  {href: '/admin/news', label: 'Actualités'},
  {href: '/admin/opportunities', label: 'Opportunités'},
  {href: '/admin/subscribers', label: 'Inscrits newsletter'}
];

export default function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {NAV.map((n) => {
        const active = isActive(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? 'page' : undefined}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors ${
              active
                ? 'bg-indigo text-white'
                : 'text-encre hover:bg-sable-2'
            }`}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
