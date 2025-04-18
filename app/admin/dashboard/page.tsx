import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { EditarEquipeDialog } from '@/components/admin/EditarEquipeDialog';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  const inscricoes = await prisma.inscricaoEquipe.findMany({
    where: { status: 'PENDENTE' },
    include: { jogadores: true },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Painel Administrativo
      </h1>

      {inscricoes.length === 0 ? (
        <p className="text-gray-600">Nenhuma inscrição pendente.</p>
      ) : (
        <div className="space-y-6">
          {inscricoes.map((inscricao) => (
            <div
              key={inscricao.id}
              className="border rounded p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-blue-800">
                  {inscricao.nome}
                </h2>

                <EditarEquipeDialog
                  equipe={{
                    ...inscricao,
                    jogadores: inscricao.jogadores.map((j) => ({
                      ...j,
                      fotoUrl: j.fotoUrl ?? null,
                    })),
                  }}
                />
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Capitão: {inscricao.capitao} • Contato: {inscricao.contato}
              </p>

              <ul className="mb-3 space-y-1 text-sm">
                {inscricao.jogadores.map((jogador) => (
                  <li key={jogador.id}>
                    #{jogador.numero} - {jogador.nome} ({jogador.posicao})
                  </li>
                ))}
              </ul>

              <div className="flex gap-3">
                <form action={`/admin/approve/${inscricao.id}`} method="POST">
                  <Button type="submit" variant="default" size="sm">
                    ✅ Aprovar
                  </Button>
                </form>
                <form action={`/admin/rejeitar/${inscricao.id}`} method="POST">
                  <Button type="submit" variant="destructive" size="sm">
                    ❌ Rejeitar
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
