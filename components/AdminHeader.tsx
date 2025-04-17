'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../components/ui/button';

export function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-gray-900 text-white py-4 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link href="/admin/dashboard" className="text-lg font-bold">
          🛠 Painel Administrativo
        </Link>

        <nav className="flex gap-6 text-sm">
          <Link href="/admin/jogos" className="hover:underline">
            Jogos
          </Link>
          <Link href="/admin/equipes-aprovadas" className="hover:underline">
            Equipes
          </Link>
          <Link href="/admin/inscricoes" className="hover:underline">
            Inscrições
          </Link>
        </nav>

        <div>
          {session?.user ? (
            <Button size="sm" variant="ghost" onClick={() => signOut()}>
              Sair
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
