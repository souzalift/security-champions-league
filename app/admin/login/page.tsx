'use client';

import { LoginForm } from '@/components/admin/LoginForm';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center px-4 pt-44">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Painel Administrativo
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Faça login para acessar o sistema.
        </p>
        <LoginForm />
      </Card>
    </main>
  );
}
