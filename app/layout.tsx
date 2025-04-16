import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NavBar } from '@/components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Security Champions League',
  description: 'Torneio oficial de futsal com 8 equipes participantes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <header className="bg-blue-700 text-white sticky top-0 z-50 shadow-md backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold tracking-wide text-center">
              <span className="text-black">⚽</span> Security Champions League
              ⚽
            </h1>
          </div>
          <NavBar />
        </header>

        <main className="min-h-screen bg-gray-100 px-4 py-8 max-w-6xl mx-auto">
          {children}
        </main>

        <footer className="w-full text-center py-4 text-sm text-gray-600 bg-white border-t">
          &copy; {new Date().getFullYear()} Security Champions League. Todos os
          direitos reservados.
        </footer>
      </body>
    </html>
  );
}
