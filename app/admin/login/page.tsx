'use client';

import { signIn } from 'next-auth/react';
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  // Removed unused 'params' variable
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro(''); // limpa erro anterior

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    console.log('Resultado do login:', res);

    if (res?.error) {
      setErro('Credenciais inválidas');
    } else if (res?.ok) {
      router.push('/admin/dashboard');
    } else {
      setErro('Erro desconhecido ao logar');
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="bg-white p-6 rounded shadow-md w-full max-w-md"
    >
      <h1 className="text-xl font-bold mb-4 text-center text-blue-700">
        Painel Administrativo
      </h1>

      {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}

      <label className="block mb-2 text-sm font-medium">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 mb-4 rounded"
        placeholder="Digite seu email"
        required
      />

      <label className="block mb-2 text-sm font-medium">Senha</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border px-3 py-2 mb-4 rounded"
        title="Digite sua senha"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Entrar
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-5 flex items-center justify-center bg-gray-100">
      <Suspense fallback={<p>Carregando...</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
