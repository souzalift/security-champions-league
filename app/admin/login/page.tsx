'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

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
      className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md"
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Bem-vindo!
      </h1>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Faça login para acessar o painel administrativo.
      </p>

      {erro && (
        <p className="bg-red-100 text-red-800 text-sm px-4 py-2 rounded mb-4">
          {erro}
        </p>
      )}

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite seu email"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Senha
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite sua senha"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Entrar
      </button>

      <p className="text-sm text-gray-500 mt-4 text-center">
        Esqueceu sua senha?{' '}
        <a href="#" className="text-blue-600 hover:underline">
          Clique aqui
        </a>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
