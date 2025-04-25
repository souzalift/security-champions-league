export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { BotaoEditarJogo } from '@/components/BotaoEditarJogo';
import { BotaoExcluirJogo } from '@/components/BotaoExcluirJogo';

export default async function AdminJogosPage() {
  const jogos = await prisma.jogo.findMany({
    where: {
      status: { in: ['AGENDADO', 'EM_ANDAMENTO'] },
    },
    include: {
      equipeCasa: true,
      equipeFora: true,
    },
    orderBy: { data: 'asc' },
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6 text-blue-700">
        🛠️ Atualizar Resultados
      </h1>

      {jogos.length === 0 ? (
        <p className="text-gray-600">Nenhum jogo pendente de resultado.</p>
      ) : (
        <ul className="space-y-4">
          {jogos.map(
            (jogo: {
              id: string;
              data: Date;
              local: string;
              status: string;
              golsCasa: number;
              golsFora: number;
              equipeCasa: { nome: string };
              equipeFora: { nome: string };
            }) => (
              <li
                key={jogo.id}
                className="border rounded p-4 bg-white shadow-sm"
              >
                <div className="mb-2 font-semibold">
                  {jogo.equipeCasa.nome} vs {jogo.equipeFora.nome}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {new Date(jogo.data).toLocaleString()} - {jogo.local}
                </div>

                <div className="flex gap-2">
                  <BotaoEditarJogo id={jogo.id} />

                  {jogo.status === 'AGENDADO' && (
                    <BotaoExcluirJogo id={jogo.id} />
                  )}
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </main>
  );
}
