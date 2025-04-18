'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadLogo } from '@/components/UploadLogo'; // Certifique-se do path correto

type Jogador = {
  nome: string;
  posicao: string;
  numero: number;
};

export default function InscricaoPage() {
  const router = useRouter();

  const [equipe, setEquipe] = useState({
    nome: '',
    contato: '',
    capitao: '',
    aceite: false,
    logoUrl: '',
  });

  const [jogadores, setJogadores] = useState<Jogador[]>([
    { nome: '', posicao: '', numero: 1 },
  ]);

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange<K extends keyof Jogador>(
    index: number,
    field: K,
    value: Jogador[K],
  ) {
    const updated = [...jogadores];
    updated[index][field] = value;
    setJogadores(updated);
  }

  function addJogador() {
    if (jogadores.length < 10) {
      setJogadores([...jogadores, { nome: '', posicao: '', numero: 0 }]);
    }
  }

  function removeJogador(index: number) {
    if (jogadores.length > 8) {
      setJogadores(jogadores.filter((_, i) => i !== index));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso(false);
    setLoading(true);

    const res = await fetch('/api/inscricao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...equipe, jogadores }),
    });

    setLoading(false);

    if (res.ok) {
      setSucesso(true);
      router.refresh();
      setEquipe({
        nome: '',
        contato: '',
        capitao: '',
        aceite: false,
        logoUrl: '',
      });
      setJogadores([{ nome: '', posicao: '', numero: 1 }]);
    } else {
      const json = await res.json();
      setErro(json.error || 'Erro ao enviar inscrição.');
      console.error(json);
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">
        📝 Inscrição de Equipe
      </h1>

      {erro && <p className="text-red-600 mb-4 text-sm text-center">{erro}</p>}
      {sucesso && (
        <p className="text-green-600 mb-4 text-sm text-center">
          ✅ Inscrição enviada com sucesso!
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label htmlFor="nome" className="flex flex-col">
            Nome da equipe
            <input
              id="nome"
              type="text"
              placeholder="Ex: Guardiões da Rede"
              value={equipe.nome}
              onChange={(e) => setEquipe({ ...equipe, nome: e.target.value })}
              required
              className="input"
            />
          </label>

          <label htmlFor="capitao" className="flex flex-col">
            Capitão da equipe
            <input
              id="capitao"
              type="text"
              placeholder="Ex: João Silva"
              value={equipe.capitao}
              onChange={(e) =>
                setEquipe({ ...equipe, capitao: e.target.value })
              }
              required
              className="input"
            />
          </label>

          <label htmlFor="contato" className="flex flex-col md:col-span-2">
            Contato (WhatsApp ou Email)
            <input
              id="contato"
              type="text"
              placeholder="(11) 99999-9999 ou email@dominio.com"
              value={equipe.contato}
              onChange={(e) =>
                setEquipe({ ...equipe, contato: e.target.value })
              }
              required
              className="input"
            />
          </label>

          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2 block">
              Logo da equipe (opcional)
            </label>
            <UploadLogo
              onUploadComplete={(url) =>
                setEquipe((prev) => ({ ...prev, logoUrl: url }))
              }
            />
            {equipe.logoUrl && (
              <img
                src={equipe.logoUrl}
                alt="Logo preview"
                className="w-20 h-20 mt-2 object-contain border rounded"
              />
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2 text-blue-600">
            Jogadores ({jogadores.length}/10)
          </h2>

          {jogadores.map((j, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end mb-3"
            >
              <input
                type="text"
                placeholder="Nome do jogador"
                value={j.nome}
                onChange={(e) => handleChange(i, 'nome', e.target.value)}
                required
                className="input"
              />

              <select
                title="Posição"
                value={j.posicao}
                onChange={(e) => handleChange(i, 'posicao', e.target.value)}
                required
                className="input"
              >
                <option value="" disabled>
                  Posição
                </option>
                <option value="Goleiro">Goleiro</option>
                <option value="Fixo">Fixo</option>
                <option value="Ala">Ala</option>
                <option value="Pivô">Pivô</option>
              </select>

              <input
                type="number"
                placeholder="Número"
                value={j.numero}
                onChange={(e) =>
                  handleChange(i, 'numero', Number(e.target.value))
                }
                required
                className="input"
              />

              {i >= 8 && (
                <button
                  type="button"
                  className="text-red-500 text-sm ml-2"
                  onClick={() => removeJogador(i)}
                >
                  Remover
                </button>
              )}
            </div>
          ))}

          {jogadores.length < 10 && (
            <button
              type="button"
              onClick={addJogador}
              className="btn mt-2 text-sm"
            >
              + Adicionar Jogador
            </button>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={equipe.aceite}
            onChange={(e) => setEquipe({ ...equipe, aceite: e.target.checked })}
            required
          />
          Li e aceito o{' '}
          <a
            href="/regulamento.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600"
          >
            regulamento oficial
          </a>
        </label>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Enviando...' : 'Enviar Inscrição'}
        </button>
      </form>
    </main>
  );
}
