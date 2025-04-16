import { prisma } from '@/lib/prisma';
import ReverterAprovacaoButton from '@/components/ReverterAprovacaoButton';

export default async function EquipesAprovadasPage() {
  const inscricoes = await prisma.inscricaoEquipe.findMany({
    where: { status: 'APROVADA' },
    include: { jogadores: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        ✅ Equipes Aprovadas
      </h1>

      {inscricoes.length === 0 ? (
        <p className="text-gray-600">Nenhuma equipe aprovada até o momento.</p>
      ) : (
        <ul className="space-y-6">
          {inscricoes.map((inscricao) => (
            <li
              key={inscricao.id}
              className="bg-white border rounded p-4 shadow-sm space-y-2"
            >
              <div className="text-lg font-bold text-blue-800">
                {inscricao.nome}
              </div>
              <div className="text-sm text-gray-600">
                👤 Capitão: {inscricao.capitao}
              </div>
              <div className="text-sm text-gray-600">
                📞 Contato: {inscricao.contato}
              </div>

              <div className="mt-2">
                <h3 className="font-semibold text-sm text-gray-700 mb-1">
                  Jogadores:
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {inscricao.jogadores.map((j) => (
                    <li key={j.id} className="border p-2 rounded">
                      #{j.numero} — {j.nome} ({j.posicao})
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botão de reverter aprovação */}
              <ReverterAprovacaoButton inscricaoId={inscricao.id} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
