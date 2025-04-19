'use client';

import Link from 'next/link';
import Image from 'next/image'; // Importando o componente Image
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isLogin = session?.user?.email;
  var links = [];

  if (isLogin) {
    links = [
      { href: '/admin/dashboard', label: 'Dashboard' },
      { href: '/', label: 'Classificação' },
      { href: '/admin/equipes', label: 'Equipes' },
      { href: '/admin/jogos', label: 'Jogos' },
      { href: '/artilharia', label: 'Artilharia' },
      { href: '/regulamento', label: 'Regulamento' },
    ];
  } else {
    links = [
      { href: '/', label: 'Classificação' },
      { href: '/jogos', label: 'Jogos' },
      { href: '/equipes', label: 'Equipes' },
      { href: '/artilharia', label: 'Artilharia' },
      { href: '/regulamento', label: 'Regulamento' },
    ];
  }
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
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="hidden md:block">
          {session?.user ? (
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
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className="text-blue-700 hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr />
                {session?.user ? (
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
