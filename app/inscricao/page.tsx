/* eslint-disable @typescript-eslint/ban-ts-comment */
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
    // @ts-ignore
    novo[index][field] = value;
    setJogadores(novo);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (jogadores.length < 8) {
      setErro('Você deve cadastrar pelo menos 8 jogadores.');
      return;
    }

    if (!equipe.aceite) {
      setErro('Você precisa aceitar o regulamento.');
      return;
    }

    const res = await fetch('/api/inscricao', {
      method: 'POST',
      body: JSON.stringify({ ...equipe, jogadores }),
    });

    if (res.ok) {
      alert('Inscrição enviada com sucesso!');
      location.reload();
    } else {
      const json = await res.json();
      setErro(json.error || 'Erro ao enviar inscrição.');
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        📋 Inscrição de Equipe
      </h1>

      {erro && <p className="text-red-600 mb-4 text-sm">{erro}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded shadow"
      >
        {/* Dados da equipe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nome do Time"
            value={equipe.nome}
            onChange={(e) => setEquipe({ ...equipe, nome: e.target.value })}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Capitão"
            value={equipe.capitao}
            onChange={(e) => setEquipe({ ...equipe, capitao: e.target.value })}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Contato (telefone ou email)"
            value={equipe.contato}
            onChange={(e) => setEquipe({ ...equipe, contato: e.target.value })}
            required
            className="input md:col-span-2"
          />
        </div>

        {/* Lista de jogadores */}
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
                value={jogador.nome}
                onChange={(e) =>
                  handleChangeJogador(index, 'nome', e.target.value)
                }
                required
                className="input"
              />
              <input
                type="text"
                placeholder="Posição"
                value={jogador.posicao}
                onChange={(e) =>
                  handleChangeJogador(index, 'posicao', e.target.value)
                }
                required
                className="input"
              />
              <input
                type="number"
                placeholder="Número"
                value={jogador.numero}
                onChange={(e) =>
                  handleChangeJogador(index, 'numero', e.target.value)
                }
                required
                min={1}
                max={99}
                className="input"
              />

              {jogadores.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveJogador(index)}
                  className="text-sm text-red-600 hover:underline md:col-span-3 text-left"
                >
                  ❌ Remover jogador
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddJogador}
            className="btn bg-gray-100 border text-sm"
          >
            ➕ Adicionar Jogador
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
          <span>Li e aceito o regulamento do torneio.</span>
        </label>

        <button type="submit" className="btn-primary w-full">
          Enviar Inscrição
        </button>
      </form>
    </main>
  );
}
