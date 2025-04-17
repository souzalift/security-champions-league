import { ReactNode } from 'react';
import { AdminHeader } from '@/components/AdminHeader';
import { AuthProvider } from '@/components/AuthProvider'; // SessionProvider wrapper
import '@/app/globals.css';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthProvider>
        <AdminHeader />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </AuthProvider>
    </>
  );
}
