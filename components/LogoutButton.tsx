'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700"
    >
      Sair
    </button>
  );
}
