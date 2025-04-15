'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { signOut } from 'next-auth/react';

const links = [
  { href: '/admin/dashboard', label: 'Inscrições' },
  { href: '/admin/jogos', label: 'Resultados' },
  { href: '/admin/jogos/novo', label: '+ Novo Jogo' },
];

export function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'text-sm hover:underline',
                pathname === link.href ? 'font-semibold text-yellow-300' : '',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-sm text-red-300 hover:text-red-500"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
