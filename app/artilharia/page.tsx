import { prisma } from '@/lib/prisma';

export default async function ArtilhariaPage() {
  const artilheiros = await prisma.jogador.findMany({
    where: {
      gols: { some: {} }, // Somente quem fez gols
    },
    include: {
      equipe: true,
      _count: {
        select: { gols: true },
      },
    },
    orderBy: [{ gols: { _count: 'desc' } }, { nome: 'asc' }],
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">🏆 Artilharia</h1>

      {artilheiros.length === 0 ? (
        <p className="text-gray-500">Nenhum gol marcado ainda.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-2">#</th>
              <th className="p-2">Jogador</th>
              <th className="p-2">Equipe</th>
              <th className="p-2 text-center">Gols</th>
            </tr>
          </thead>
          <tbody>
            {artilheiros.map((jogador, idx) => (
              <tr key={jogador.id} className="border-t">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">{jogador.nome}</td>
                <td className="p-2">{jogador.equipe.nome}</td>
                <td className="p-2 text-center font-semibold">
                  {jogador._count.gols}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
