'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isLogin = !!session?.user?.email;

  const [open, setOpen] = useState(false);

  function handleLinkClick() {
    setOpen(false);
  }

  return (
    <header className="bg-blue-700 text-white shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-wide flex items-center gap-2"
        >
          <Image
            src="/logo.png"
            alt="Logo Security Champions League"
            width={216}
            height={143}
            className="h-8 w-auto"
          />
          Security Champions League
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium items-center">
          <Link
            href="/"
            className={
              pathname === '/'
                ? 'text-yellow-400 font-bold'
                : 'hover:text-yellow-400'
            }
          >
            Classificação
          </Link>
          <Link
            href="/jogos"
            className={
              pathname === '/jogos'
                ? 'text-yellow-400 font-bold'
                : 'hover:text-yellow-400'
            }
          >
            Jogos
          </Link>
          <Link
            href="/equipes"
            className={
              pathname === '/equipes'
                ? 'text-yellow-400 font-bold'
                : 'hover:text-yellow-400'
            }
          >
            Equipes
          </Link>
          <Link
            href="/artilharia"
            className={
              pathname === '/artilharia'
                ? 'text-yellow-400 font-bold'
                : 'hover:text-yellow-400'
            }
          >
            Artilharia
          </Link>
          <Link
            href="/inscricao"
            className={
              pathname === '/inscricao'
                ? 'text-yellow-400 font-bold'
                : 'hover:text-yellow-400'
            }
          >
            Inscrição
          </Link>
          <Link
            href="/regulamento"
            className={
              pathname === '/regulamento'
                ? 'text-yellow-400 font-bold'
                : 'hover:text-yellow-400'
            }
          >
            Regulamento
          </Link>

          {isLogin && (
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-yellow-400 cursor-pointer">
                Administração
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/dashboard"
                    className={
                      pathname === '/admin/dashboard'
                        ? 'text-yellow-400 font-bold'
                        : 'hover:text-yellow-400'
                    }
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/equipes/aprovadas"
                    className={
                      pathname === '/admin/equipes/aprovadas'
                        ? 'text-yellow-400 font-bold'
                        : 'hover:text-yellow-400'
                    }
                  >
                    Equipes Aprovadas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/equipes/rejeitadas"
                    className={
                      pathname === '/admin/equipes/rejeitadas'
                        ? 'text-yellow-400 font-bold'
                        : 'hover:text-yellow-400'
                    }
                  >
                    Equipes Rejeitadas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/jogos/novo"
                    className={
                      pathname === '/admin/jogos/novo'
                        ? 'text-yellow-400 font-bold'
                        : 'hover:text-yellow-400'
                    }
                  >
                    Adicionar Partida
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/jogos"
                    className={
                      pathname === '/admin/jogos'
                        ? 'text-yellow-400 font-bold'
                        : 'hover:text-yellow-400'
                    }
                  >
                    Atualizar Partida
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/jogos/finalizados"
                    className={
                      pathname === '/admin/jogos/finalizados'
                        ? 'text-yellow-400 font-bold'
                        : 'hover:text-yellow-400'
                    }
                  >
                    Partidas Finalizadas
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Auth */}
        <div className="hidden md:block">
          {isLogin ? (
            <Button size="sm" variant="ghost" onClick={() => signOut()}>
              Sair
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => signIn()}>
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="mb-4 text-lg font-bold">Menu</SheetHeader>
              <div className="flex flex-col gap-4 text-sm">
                <Link href="/" onClick={handleLinkClick}>
                  Classificação
                </Link>
                <Link href="/jogos" onClick={handleLinkClick}>
                  Jogos
                </Link>
                <Link href="/equipes" onClick={handleLinkClick}>
                  Equipes
                </Link>
                <Link href="/artilharia" onClick={handleLinkClick}>
                  Artilharia
                </Link>
                <Link href="/inscricao" className="hover:underline">
                  Inscrição
                </Link>
                <Link href="/regulamento" onClick={handleLinkClick}>
                  Regulamento
                </Link>

                {isLogin && (
                  <>
                    <hr />
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Administração
                    </p>
                    <Link href="/admin/dashboard" onClick={handleLinkClick}>
                      Dashboard
                    </Link>
                    <Link
                      href="/admin/equipes/aprovadas"
                      onClick={handleLinkClick}
                    >
                      Equipes Aprovadas
                    </Link>
                    <Link
                      href="/admin/equipes/rejeitadas"
                      onClick={handleLinkClick}
                    >
                      Equipes Rejeitadas
                    </Link>
                    <Link href="/admin/jogos/novo" onClick={handleLinkClick}>
                      Adicionar Partida
                    </Link>
                    <Link href="/admin/jogos" onClick={handleLinkClick}>
                      Atualizar Partida
                    </Link>
                    <Link
                      href="/admin/jogos/finalizados"
                      onClick={handleLinkClick}
                    >
                      Partidas Finalizadas
                    </Link>
                  </>
                )}

                <hr />
                {isLogin ? (
                  <Button
                    size="sm"
                    className="bg-blue-600"
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                  >
                    Sair
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-blue-600"
                    onClick={() => {
                      setOpen(false);
                      signIn();
                    }}
                  >
                    Login
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
