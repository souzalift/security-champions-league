'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserPlus2, User } from 'lucide-react';

export function AdminHeader() {
  const { data: session } = useSession();

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/equipes-aprovadas', label: 'Equipes' },
    { href: '/admin/jogos', label: 'Jogos' },
    { href: '/admin/jogos/novo', label: 'Novo Jogo' },
  ];

  return (
    <header className="bg-gray-900 text-white py-4 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link href="/admin/dashboard" className="text-lg font-bold">
          Painel Administrativo 🛡️
        </Link>

        <nav className="flex gap-6 text-sm items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:underline transition"
            >
              {link.label}
            </Link>
          ))}

          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  {session.user.email}
                </div>
                <DropdownMenuItem onClick={() => signOut()}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
}
