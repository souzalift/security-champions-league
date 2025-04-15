import { prisma } from '@/lib/prisma';

export default async function ArtilhariaPage() {
  const jogadores = await prisma.jogador.findMany({
    include: {
      equipe: true,
      gols: true,
    },
  });

  const artilheiros = jogadores
    .map(
      (jogador: {
        id: string;
        nome: string;
        equipe: { nome: string };
        gols: unknown[];
      }) => ({
        id: jogador.id,
        nome: jogador.nome,
        equipe: jogador.equipe.nome,
        gols: jogador.gols.length,
      }),
    )
    .filter((j: { gols: number }) => j.gols > 0)
    .sort((a, b) => b.gols - a.gols || a.nome.localeCompare(b.nome));

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
        🎯 Artilharia
      </h1>

      {artilheiros.length === 0 ? (
        <p className="text-gray-500 text-center">
          Nenhum gol registrado até o momento.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded shadow-sm">
            <thead className="bg-blue-600 text-white text-xs uppercase">
              <tr>
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Jogador</th>
                <th className="p-2 text-left">Equipe</th>
                <th className="p-2 text-center">Gols</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {artilheiros.map((jogador, idx) => (
                <tr key={jogador.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2 font-medium">{jogador.nome}</td>
                  <td className="p-2 text-gray-600">{jogador.equipe}</td>
                  <td className="p-2 text-center font-bold text-blue-700">
                    {jogador.gols}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
