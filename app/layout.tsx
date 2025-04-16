import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

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
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <header className="bg-blue-700 text-white sticky top-0 z-50 shadow-md backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold tracking-wide text-center">
              <span className="text-black">⚽</span> Security Champions League
              ⚽
            </h1>
          </div>
          <NavBar />
        </header>

        <main className="flex-grow">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
