'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

const NAV = [
  {href: '/abdoussamad', label: 'Tableau de bord'},
  {href: '/abdoussamad/requests', label: "Demandes d'adhésion"},
  {href: '/abdoussamad/contributions', label: 'Contributions'},
  {href: '/abdoussamad/peoples', label: 'Peuples'},
  {href: '/abdoussamad/organizations', label: 'Organisations'},
  {href: '/abdoussamad/partners', label: 'Partenaires'},
  {href: '/abdoussamad/news', label: 'Actualités'},
  {href: '/abdoussamad/opportunities', label: 'Opportunités'},
  {href: '/abdoussamad/subscribers', label: 'Inscrits newsletter'}
];

export default function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/abdoussamad' ? pathname === '/abdoussamad' : pathname.startsWith(href);

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
