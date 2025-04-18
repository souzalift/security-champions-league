// /app/admin/equipes/rejeitadas/page.tsx

import { prisma } from '@/lib/prisma';
import { ExcluirEquipeDialog } from '@/components/admin/ExcluirEquipeDialog';
import { RestaurarEquipeButton } from '@/components/admin/RestaurarEquipeButton';

export default async function EquipesRejeitadasPage() {
  const rejeitadas = await prisma.inscricaoEquipe.findMany({
    where: { status: 'REJEITADA' },
    include: { jogadores: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-red-700 mb-6">
        🗃️ Equipes Rejeitadas
      </h1>

      {rejeitadas.length === 0 ? (
        <p className="text-gray-600">Nenhuma equipe rejeitada.</p>
      ) : (
        <ul className="space-y-6">
          {rejeitadas.map((equipe) => (
            <li
              key={equipe.id}
              className="border rounded shadow-sm bg-white p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {equipe.nome}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Capitão: {equipe.capitao} • Contato: {equipe.contato}
                  </p>
                </div>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {equipe.jogadores.map((j) => (
                  <li
                    key={j.id}
                    className="border px-3 py-2 rounded text-gray-700"
                  >
                    #{j.numero} — {j.nome} ({j.posicao})
                  </li>
                ))}
              </ul>

              <div className="flex gap-3 pt-2">
                <RestaurarEquipeButton equipeId={equipe.id} />
                <ExcluirEquipeDialog equipeId={equipe.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
