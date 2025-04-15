/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Jogador = {
  id: string;
  nome: string;
  equipeId: string;
};

type Props = {
  jogo: {
    id: string;
    equipeCasa: { id: string; nome: string };
    equipeFora: { id: string; nome: string };
    golsCasa: number;
    golsFora: number;
  };
};

export default function FormEditarResultado({ jogo }: Props) {
  const [golsCasa, setGolsCasa] = useState(jogo.golsCasa);
  const [golsFora, setGolsFora] = useState(jogo.golsFora);
  const [erro, setErro] = useState('');
  const [gols, setGols] = useState<{ jogadorId: string; minuto?: number }[]>(
    [],
  );

  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const router = useRouter();

  async function buscarJogadores() {
    const res = await fetch('/api/jogadores');
    const json = await res.json();
    setJogadores(json);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    const res = await fetch(`/api/jogos/${jogo.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        golsCasa,
        golsFora,
        gols,
      }),
    });

    if (res.ok) {
      router.push('/admin/jogos');
    } else {
      const json = await res.json();
      setErro(json.error || 'Erro ao salvar');
    }
  }

  function addGol() {
    setGols([...gols, { jogadorId: '', minuto: undefined }]);
    if (jogadores.length === 0) buscarJogadores();
  }

  function updateGol(index: number, key: string, value: string | number) {
    const clone = [...gols];
    // @ts-ignore
    clone[index][key] = value;
    setGols(clone);
  }

  function removeGol(index: number) {
    setGols(gols.filter((_, i) => i !== index));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-4 rounded shadow"
    >
      <h2 className="font-semibold text-blue-600">Placar Final</h2>

      {erro && <p className="text-red-500 text-sm">{erro}</p>}

      <div className="grid grid-cols-2 gap-4">
        <label>
          {jogo.equipeCasa.nome}
          <input
            type="number"
            className="input"
            value={golsCasa}
            onChange={(e) => setGolsCasa(Number(e.target.value))}
            min={0}
            required
          />
        </label>

        <label>
          {jogo.equipeFora.nome}
          <input
            type="number"
            className="input"
            value={golsFora}
            onChange={(e) => setGolsFora(Number(e.target.value))}
            min={0}
            required
          />
        </label>
      </div>

      <h2 className="font-semibold text-blue-600">Gols Individuais</h2>

      <div className="space-y-2">
        {gols.map((gol, index) => (
          <div key={index} className="flex gap-2 items-center">
            <select
              className="input flex-1"
              value={gol.jogadorId}
              onChange={(e) => updateGol(index, 'jogadorId', e.target.value)}
              required
              aria-label="Selecionar jogador"
            >
              <option value="">Selecione o jogador</option>
              {jogadores.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nome}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Minuto"
              className="input w-24"
              value={gol.minuto || ''}
              onChange={(e) =>
                updateGol(index, 'minuto', Number(e.target.value))
              }
            />

            <button
              type="button"
              onClick={() => removeGol(index)}
              className="text-red-600 font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addGol}
        className="btn bg-gray-100 border text-sm"
      >
        + Adicionar Gol
      </button>

      <button type="submit" className="btn-primary w-full mt-4">
        Salvar Resultado
      </button>
    </form>
  );
}
