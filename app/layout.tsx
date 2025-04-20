import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/components/AuthProvider';
import { PageTransition } from '@/components/PageTransition';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

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
    <html lang="pt-BR" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
            <PageTransition>
              {children}
              <SpeedInsights />
            </PageTransition>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
