import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/LogoutButton';
import { AdminNavbar } from '@/components/AdminNavbar';

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

  async function reverterAprovacao(id: string) {
    const confirmado = confirm(
      'Tem certeza que deseja reverter esta aprovação? Isso irá excluir a equipe criada.',
    );
    if (!confirmado) return;

    const res = await fetch(`/api/admin/reverter/${id}`, {
      method: 'DELETE',
    });

    const json = await res.json();

    if (res.ok) {
      alert('✅ Equipe removida e inscrição revertida com sucesso.');
      location.reload();
    } else {
      alert(json.error || 'Erro ao reverter inscrição.');
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Painel Administrativo
      </h1>
      <LogoutButton />

      {inscricoes.length === 0 ? (
        <p className="text-gray-600">Nenhuma inscrição pendente.</p>
      ) : (
        <div className="space-y-6">
          {inscricoes.map((inscricao) => (
            <div
              key={inscricao.id}
              className="border rounded p-4 bg-white shadow-sm"
            >
              <h2 className="text-lg font-semibold text-blue-800 mb-1">
                {inscricao.nome}
              </h2>
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
                  <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm">
                    ✅ Aprovar
                  </button>
                </form>
                <form action={`/admin/rejeitar/${inscricao.id}`} method="POST">
                  <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm">
                    ❌ Rejeitar
                  </button>

                  {inscricao.status === 'APROVADA' && (
                    <button
                      onClick={() => reverterAprovacao(inscricao.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      🔄 Reverter aprovação
                    </button>
                  )}
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
