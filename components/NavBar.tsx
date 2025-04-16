'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/', label: 'Classificação' },
  { href: '/jogos', label: 'Jogos' },
  { href: '/equipes', label: 'Equipes' },
  { href: '/artilharia', label: 'Artilharia' },
  { href: '/inscricao', label: 'Inscreva-se' },
  { href: '/regulamento', label: 'Regulamento' },
];

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-blue-700 text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-wide">
          ⚽ SCL
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:underline ${
                  pathname === link.href ? 'underline text-yellow-300' : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Abrir menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden px-4 pb-4 space-y-2 text-sm bg-blue-800">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block py-2 px-2 rounded hover:bg-blue-600 ${
                  pathname === link.href ? 'bg-blue-600 text-yellow-300' : ''
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
