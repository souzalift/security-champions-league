/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  equipes: { id: string; nome: string }[];
};

export default function FormNovoJogo({ equipes }: Props) {
  const router = useRouter();
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');
  const [casa, setCasa] = useState('');
  const [fora, setFora] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (casa === fora) {
      setErro('As equipes devem ser diferentes.');
      return;
    }

    const res = await fetch('/api/jogos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        equipeCasaId: casa,
        equipeForaId: fora,
        data,
        local,
      }),
    });

    const json = await res.json();

    if (res.ok) {
      router.push('/jogos');
    } else {
      const json = await res.json();
      setErro(json.error || 'Erro ao criar jogo');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erro && <p className="text-red-600 text-sm">{erro}</p>}

      <label className="block">
        <span className="text-sm font-medium">Equipe Casa</span>
        <select
          className="input"
          value={casa}
          onChange={(e) => setCasa(e.target.value)}
          required
        >
          <option value="">Selecione</option>
          {equipes.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.nome}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Equipe Fora</span>
        <select
          className="input"
          value={fora}
          onChange={(e) => setFora(e.target.value)}
          required
        >
          <option value="">Selecione</option>
          {equipes.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.nome}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Data e Hora</span>
        <input
          type="datetime-local"
          className="input"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Local</span>
        <input
          type="text"
          className="input"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          required
        />
      </label>

      <button type="submit" className="btn-primary w-full">
        Criar Jogo
      </button>
    </form>
  );
}
