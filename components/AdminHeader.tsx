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
import { ChevronDown, User } from 'lucide-react';

export function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-gray-900 text-white py-4 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link href="/admin/dashboard" className="text-lg font-bold">
          Painel Administrativo 🛡️
        </Link>

        <nav className="flex gap-6 text-sm items-center">
          <Link href="/admin/dashboard" className="hover:underline transition">
            Dashboard
          </Link>

          <Link
            href="/admin/equipes-aprovadas"
            className="hover:underline transition"
          >
            Equipes
          </Link>

          {/* Dropdown de Jogos */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 gap-1 text-sm font-normal">
                Jogos <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/admin/jogos">Ver Jogos</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/jogos/novo">Adicionar Jogo</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/jogos/finalizados">Finalizados</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Usuário logado */}
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
