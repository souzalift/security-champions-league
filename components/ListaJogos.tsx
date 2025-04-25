'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { ModalJogo } from '@/components/ModalJogo';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  jogos: {
    id: string;
    data: string;
    local: string;
    status: string;
    golsCasa: number;
    golsFora: number;
    equipeCasa: { id: string; nome: string };
    equipeFora: { id: string; nome: string };
    gols: {
      id: string;
      jogadorId: string;
      jogador: { nome: string };
      minuto?: number;
    }[];
  }[];
};

export function ListaJogos({ jogos }: Props) {
  const [selectedEquipe, setSelectedEquipe] = useState('all');

  const agora = new Date();

  const equipes = Array.from(
    new Set(jogos.flatMap((j) => [j.equipeCasa.nome, j.equipeFora.nome])),
  ).sort();

  const jogosFiltrados =
    selectedEquipe === 'all'
      ? jogos // ← AQUI: quando é __all__, mostra TODOS os jogos!
      : jogos.filter(
          (j) =>
            j.equipeCasa.nome === selectedEquipe ||
            j.equipeFora.nome === selectedEquipe,
        );

  const jogosAgrupados = jogosFiltrados.reduce((acc, jogo) => {
    const dataStr = format(new Date(jogo.data), 'dd/MM/yyyy', { locale: ptBR });
    if (!acc[dataStr]) {
      acc[dataStr] = [];
    }
    acc[dataStr].push(jogo);
    return acc;
  }, {} as Record<string, typeof jogos>);

  const formatarDataCompleta = (data: string) =>
    format(new Date(data), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });

  const proximos = jogosFiltrados.filter(
    (j) => j.status === 'AGENDADO' || new Date(j.data) > agora,
  );
  const finalizados = jogosFiltrados.filter((j) => j.status === 'FINALIZADO');

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-center mb-2 text-blue-700">
        🗓️ Jogos do Torneio
      </h1>

      <div className="flex flex-col items-center gap-4 mb-8">
        <p className="text-sm text-gray-600">
          {proximos.length} agendado(s) • {finalizados.length} finalizado(s)
        </p>

        <Select
          value={selectedEquipe}
          onValueChange={(value) => setSelectedEquipe(value)}
          defaultValue="all"
        >
          <SelectTrigger className="w-60 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="Filtrar por equipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Equipes</SelectItem>
            {equipes.map((equipe) => (
              <SelectItem key={equipe} value={equipe}>
                {equipe}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Próximos Jogos */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-blue-600 text-center">
          📍 Próximos Jogos
        </h2>

        {Object.entries(jogosAgrupados)
          .filter(([, lista]) => lista.some((j) => j.status !== 'FINALIZADO')) // Substituí '_' por ', lista'
          .map(([dataStr, lista]) => (
            <div key={dataStr} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {dataStr}
              </h3>

              <ul className="space-y-4">
                {lista
                  .filter((j) => j.status !== 'FINALIZADO')
                  .map((jogo) => (
                    <li
                      key={jogo.id}
                      className="bg-white border rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="text-center sm:text-left">
                          <p className="text-lg font-semibold text-gray-800">
                            {jogo.equipeCasa.nome} vs {jogo.equipeFora.nome}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatarDataCompleta(jogo.data)} — {jogo.local}
                          </p>
                        </div>
                        <Badge
                          className={
                            jogo.status === 'FINALIZADO'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }
                        >
                          {jogo.status}
                        </Badge>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </section>

      <Separator className="my-10" />

      {/* Jogos Finalizados */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-green-700 text-center">
          ✅ Jogos Finalizados
        </h2>

        {Object.entries(jogosAgrupados)
          .filter(([, lista]) => lista.some((j) => j.status === 'FINALIZADO')) // Substituí '_' por ', lista'
          .map(([dataStr, lista]) => (
            <div key={dataStr} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {dataStr}
              </h3>

              <ul className="space-y-4">
                {lista
                  .filter((j) => j.status === 'FINALIZADO')
                  .map((jogo) => (
                    <li
                      key={jogo.id}
                      className="bg-gray-50 border rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="text-center sm:text-left w-full">
                          <p className="text-lg font-semibold text-gray-800">
                            {jogo.equipeCasa.nome}{' '}
                            <span className="text-blue-600 font-bold">
                              {jogo.golsCasa}
                            </span>{' '}
                            x{' '}
                            <span className="text-red-600 font-bold">
                              {jogo.golsFora}
                            </span>{' '}
                            {jogo.equipeFora.nome}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatarDataCompleta(jogo.data)} — {jogo.local}
                          </p>
                          <div className="mt-2">
                            <ModalJogo
                              jogoId={jogo.id}
                              equipeCasa={jogo.equipeCasa.nome}
                              equipeFora={jogo.equipeFora.nome}
                              golsCasa={jogo.golsCasa}
                              golsFora={jogo.golsFora}
                              local={jogo.local}
                              dataFormatada={formatarDataCompleta(jogo.data)}
                              gols={jogo.gols}
                            />
                          </div>
                        </div>
                        <Badge>{jogo.status}</Badge>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </section>
    </main>
  );
}
