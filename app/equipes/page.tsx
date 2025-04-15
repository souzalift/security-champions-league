import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export default async function EquipesPage() {
  const equipes = await prisma.equipe.findMany({
    include: {
      jogadores: {
        orderBy: {
          numero: 'asc',
        },
      },
    },
    orderBy: {
      nome: 'asc',
    },
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">👥 Equipes Participantes</h1>

      {equipes.length === 0 ? (
        <p className="text-gray-500">Nenhuma equipe cadastrada ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {equipes.map((equipe) => (
            <div key={equipe.id} className="bg-white rounded shadow p-4 border">
              <h2 className="text-lg font-semibold text-blue-700 mb-2">
                {equipe.nome}
              </h2>

              {equipe.jogadores.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Nenhum jogador registrado.
                </p>
              ) : (
                <ul className="space-y-2">
                  {equipe.jogadores.map((jogador) => (
                    <li
                      key={jogador.id}
                      className="flex items-center gap-3 border-b pb-2 text-sm"
                    >
                      {/* Exibir imagem se existir */}
                      {jogador.fotoUrl && (
                        <Image
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border"
                          src={jogador.fotoUrl}
                          alt={jogador.nome}
                        />
                      )}
                      <span className="font-medium">{jogador.nome}</span>
                      <span className="text-gray-600 ml-auto">
                        #{jogador.numero} • {jogador.posicao}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
