export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Badge } from '@/components/ui/badge';
import { ModalJogo } from '@/components/ModalJogo';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useState } from 'react';
import { Equipe } from '@prisma/client';

type Jogo = Awaited<ReturnType<typeof getJogoData>>[number];

async function getJogoData() {
  const jogos = await prisma.jogo.findMany({
    include: {
      equipeCasa: true,
      equipeFora: true,
      gols: {
        include: {
          jogador: {
            select: {
              id: true,
              nome: true,
              equipeId: true,
            },
          },
        },
      },
    },
    orderBy: { data: 'asc' },
  });

  return jogos;
}

export default async function JogosPage() {
  const jogos = await getJogoData();
  const agora = new Date();

  const jogosPorEquipe = jogos.filter((j) => j.equipeCasa && j.equipeFora);

  const todasEquipesUnicas = Array.from(
    new Set(
      jogosPorEquipe.flatMap((j) => [j.equipeCasa.nome, j.equipeFora.nome]),
    ),
  ).sort();

  const jogosPorData = jogos.reduce((acc, jogo) => {
    const dataStr = format(jogo.data, 'dd/MM/yyyy');
    acc[dataStr] = acc[dataStr] || [];
    acc[dataStr].push(jogo);
    return acc;
  }, {} as Record<string, Jogo[]>);

  const proximos = jogos.filter(
    (j) => j.status === 'AGENDADO' || j.data > agora,
  );
  const finalizados = jogos.filter((j) => j.status === 'FINALIZADO');

  const formatarData = (data: Date) =>
    format(data, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-center mb-2 text-blue-700">
        🗓️ Jogos do Torneio
      </h1>

      <div className="text-center text-sm text-gray-600 mb-6">
        {proximos.length} agendado(s) • {finalizados.length} finalizado(s)
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-blue-600 text-center">
          📍 Próximos Jogos
        </h2>

        {Object.entries(jogosPorData)
          .filter(([_, lista]) => lista.some((j) => j.status !== 'FINALIZADO'))
          .map(([dataStr, jogosData]) => (
            <div key={dataStr} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {dataStr}
              </h3>
              <ul className="space-y-4">
                {jogosData
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
                            {formatarData(jogo.data)} — {jogo.local}
                          </p>
                        </div>
                        <Badge>{jogo.status}</Badge>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </section>

      <Separator className="my-10" />

      <section>
        <h2 className="text-xl font-semibold mb-4 text-green-700 text-center">
          ✅ Jogos Finalizados
        </h2>

        {Object.entries(jogosPorData)
          .filter(([_, lista]) => lista.some((j) => j.status === 'FINALIZADO'))
          .map(([dataStr, jogosData]) => (
            <div key={dataStr} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {dataStr}
              </h3>
              <ul className="space-y-4">
                {jogosData
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
                            {formatarData(jogo.data)} — {jogo.local}
                          </p>
                          <div className="mt-2">
                            <ModalJogo
                              jogoId={jogo.id}
                              equipeCasa={jogo.equipeCasa.nome}
                              equipeFora={jogo.equipeFora.nome}
                              golsCasa={jogo.golsCasa}
                              golsFora={jogo.golsFora}
                              local={jogo.local}
                              dataFormatada={formatarData(jogo.data)}
                              gols={jogo.gols.map((g) => ({
                                id: g.id,
                                jogadorId: g.jogador.equipeId,
                                jogador: { nome: g.jogador.nome },
                                minuto: g.minuto ?? undefined,
                              }))}
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
