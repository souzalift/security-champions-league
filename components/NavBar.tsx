'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: 'Classificação' },
  { href: '/jogos', label: 'Jogos' },
  { href: '/artilharia', label: 'Artilharia' },
  { href: '/equipes', label: 'Equipes' },
  { href: '/inscricao', label: 'Inscrição' },
  { href: '/regulamento', label: 'Regulamento' },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-blue-800">
      <div className="max-w-6xl mx-auto px-4 py-2 flex gap-4 overflow-x-auto text-sm font-medium">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'transition-colors hover:underline',
              pathname === item.href
                ? 'text-yellow-300 font-semibold underline'
                : 'text-white hover:text-yellow-300',
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
