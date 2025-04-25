export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Badge } from '@/components/ui/badge';
import { ModalJogo } from '@/components/ModalJogo';

export default async function JogosPage() {
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
    orderBy: {
      data: 'asc',
    },
  });

  const agora = new Date();

  const proximos = jogos.filter(
    (j) => j.status === 'AGENDADO' || j.data > agora,
  );
  const finalizados = jogos.filter((j) => j.status === 'FINALIZADO');

  const formatarData = (data: Date) =>
    format(data, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-center mb-8 text-blue-700">
        🗓️ Jogos do Torneio
      </h1>

      {/* Próximos Jogos */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">
          📍 Próximos Jogos
        </h2>

        {proximos.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum jogo agendado.</p>
        ) : (
          <ul className="space-y-4">
            {proximos.map((jogo) => (
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
        )}
      </section>

      {/* Jogos Finalizados */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-center text-green-700">
          ✅ Jogos Finalizados
        </h2>

        {finalizados.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhum jogo finalizado ainda.
          </p>
        ) : (
          <ul className="space-y-4">
            {finalizados.map((jogo) => (
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
                          jogador: {
                            nome: g.jogador.nome,
                          },
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
        )}
      </section>
    </main>
  );
}
