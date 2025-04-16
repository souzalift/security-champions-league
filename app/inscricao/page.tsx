'use client';

import { useState } from 'react';

export default function InscricaoPage() {
  const [equipe, setEquipe] = useState({
    nome: '',
    capitao: '',
    contato: '',
    aceite: false,
  });

  const [jogadores, setJogadores] = useState([
    { nome: '', posicao: '', numero: '' },
  ]);

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  function handleAddJogador() {
    if (jogadores.length >= 10) {
      setErro('Máximo de 10 jogadores permitido.');
      return;
    }
    setJogadores([...jogadores, { nome: '', posicao: '', numero: '' }]);
  }

  function handleRemoveJogador(index: number) {
    const novo = [...jogadores];
    novo.splice(index, 1);
    setJogadores(novo);
  }

  function handleChangeJogador(index: number, field: string, value: string) {
    const novo = [...jogadores];
    novo[index] = {
      ...novo[index],
      [field]: field === 'numero' ? String(value) : value,
    };
    setJogadores(novo);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso(false);

    if (jogadores.length < 8) {
      setErro('Você deve cadastrar pelo menos 8 jogadores.');
      return;
    }

    const payload = {
      ...equipe,
      aceite: Boolean(equipe.aceite),
      jogadores: jogadores.map((j) => ({
        nome: j.nome,
        posicao: j.posicao,
        numero: Number(j.numero),
      })),
    };

    const res = await fetch('/api/inscricao', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      const msg =
        typeof data.error === 'string' ? data.error : 'Erro ao enviar.';
      setErro(msg);
    } else {
      setSucesso(true);
      setEquipe({ nome: '', capitao: '', contato: '', aceite: false });
      setJogadores([{ nome: '', posicao: '', numero: '' }]);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        📋 Inscrição de Equipe
      </h1>

      {erro && (
        <p className="bg-red-100 text-red-800 text-sm px-3 py-2 rounded mb-4">
          {erro}
        </p>
      )}
      {sucesso && (
        <p className="bg-green-100 text-green-800 text-sm px-3 py-2 rounded mb-4">
          ✅ Inscrição enviada com sucesso!
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded shadow"
      >
        {/* Equipe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            className="input"
            placeholder="Nome do Time"
            value={equipe.nome}
            onChange={(e) => setEquipe({ ...equipe, nome: e.target.value })}
            required
          />
          <input
            type="text"
            className="input"
            placeholder="Capitão"
            value={equipe.capitao}
            onChange={(e) => setEquipe({ ...equipe, capitao: e.target.value })}
            required
          />
          <input
            type="text"
            className="input md:col-span-2"
            placeholder="Contato (telefone ou email)"
            value={equipe.contato}
            onChange={(e) => setEquipe({ ...equipe, contato: e.target.value })}
            required
          />
        </div>

        {/* Jogadores */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-blue-600">
            Jogadores ({jogadores.length}/10)
          </h2>

          {jogadores.map((jogador, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b pb-3"
            >
              <input
                type="text"
                placeholder="Nome do Jogador"
                className="input"
                value={jogador.nome}
                onChange={(e) =>
                  handleChangeJogador(index, 'nome', e.target.value)
                }
                required
              />
              <select
                aria-label="Posição do jogador"
                className="input"
                value={jogador.posicao}
                onChange={(e) =>
                  handleChangeJogador(index, 'posicao', e.target.value)
                }
                required
              >
                <option value="">Posição</option>
                <option value="Goleiro">Goleiro</option>
                <option value="Fixo">Fixo</option>
                <option value="Pivô">Pivô</option>
                <option value="Ala">Ala</option>
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Número"
                  className="input"
                  value={jogador.numero}
                  onChange={(e) =>
                    handleChangeJogador(index, 'numero', e.target.value)
                  }
                  required
                  min={1}
                  max={99}
                />
                {jogadores.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveJogador(index)}
                    className="text-red-600 hover:text-red-800"
                    title="Remover jogador"
                  >
                    ❌
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddJogador}
            className="text-blue-600 hover:text-blue-800 "
            title="Adicionar jogador"
          >
            ➕
          </button>
        </div>

        {/* Aceite */}
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={equipe.aceite}
            onChange={(e) => setEquipe({ ...equipe, aceite: e.target.checked })}
            required
          />
          <span>
            Li e aceito o{' '}
            <a
              href="/regulamento.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              regulamento do torneio
            </a>
            .
          </span>
        </label>

        <button type="submit" className="btn-primary w-full">
          Enviar Inscrição
        </button>
      </form>
    </main>
  );
}
