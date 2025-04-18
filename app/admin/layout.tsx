import { ReactNode } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AuthProvider } from '@/components/AuthProvider'; // SessionProvider wrapper
import { Toaster } from 'sonner';
import '@/app/globals.css';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthProvider>
        <AdminHeader />
        <Toaster
          position="top-center"
          theme="light"
          richColors
          duration={4000}
        />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </AuthProvider>
    </>
  );
}
