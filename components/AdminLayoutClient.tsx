'use client';

import { AdminNavbar } from './AdminNavbar';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNavbar />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </>
  );
}
