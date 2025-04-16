import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

export default async function JogosPage() {
  const jogos = await prisma.jogo.findMany({
    include: {
      equipeCasa: true,
      equipeFora: true,
    },
    orderBy: {
      data: 'asc',
    },
  });

  const agora = new Date();

  const proximos = jogos.filter(
    (j: { status: string; data: Date }) =>
      j.status === 'AGENDADO' || j.data > agora,
  );
  const finalizados = jogos.filter(
    (j: { status: string; data: Date; golsCasa: number | null }) =>
      j.status === 'FINALIZADO' || (j.data <= agora && j.golsCasa !== null),
  );

  const formatarData = (data: Date) =>
    format(data, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });

  return (
    <main className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Jogos do Torneio</h1>

      <section className="mb-10 w-full">
        <h2 className="text-xl font-semibold mb-4 text-blue-600 text-center">
          📍 Próximos Jogos
        </h2>
        {proximos.length === 0 ? (
          <p className="text-gray-500 text-center">Nenhum jogo agendado.</p>
        ) : (
          <ul className="space-y-4">
            {proximos.map(
              (jogo: {
                id: string;
                equipeCasa: { nome: string };
                equipeFora: { nome: string };
                data: Date;
                local: string;
              }) => (
                <li key={jogo.id} className="border p-4 rounded shadow-sm">
                  <div className="text-lg font-semibold text-center">
                    {jogo.equipeCasa.nome} vs {jogo.equipeFora.nome}
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    {formatarData(jogo.data)} — {jogo.local}
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
      </section>

      <section className="w-full">
        <h2 className="text-xl font-semibold mb-4 text-green-600 text-center">
          ✅ Jogos Finalizados
        </h2>
        {finalizados.length === 0 ? (
          <p className="text-gray-500 text-center">
            Nenhum jogo finalizado ainda.
          </p>
        ) : (
          <ul className="space-y-4">
            {finalizados.map(
              (jogo: {
                id: string;
                equipeCasa: { nome: string };
                equipeFora: { nome: string };
                golsCasa: number;
                golsFora: number;
                data: Date;
                local: string;
              }) => (
                <li
                  key={jogo.id}
                  className="border p-4 rounded shadow-sm bg-gray-50"
                >
                  <div className="text-lg font-semibold text-center">
                    {jogo.equipeCasa.nome}{' '}
                    <span className="font-bold text-blue-700">
                      {jogo.golsCasa}
                    </span>{' '}
                    vs{' '}
                    <span className="font-bold text-red-700">
                      {jogo.golsFora}
                    </span>{' '}
                    {jogo.equipeFora.nome}
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    {formatarData(jogo.data)} — {jogo.local}
                  </div>
                </li>
              ),
            )}
          </ul>
        )}
      </section>
    </main>
  );
}
