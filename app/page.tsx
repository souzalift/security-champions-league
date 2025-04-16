/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  const equipes = await prisma.equipe.findMany({
    include: {
      jogosCasa: true,
      jogosFora: true,
    },
  });

  const tabela = equipes
    .map(
      (equipe: {
        id: string;
        nome: string;
        slug: string;
        jogosCasa: {
          status: string;
          equipeCasaId: string;
          golsCasa: number;
          golsFora: number;
        }[];
        jogosFora: {
          status: string;
          equipeCasaId: string;
          golsCasa: number;
          golsFora: number;
        }[];
      }) => {
        const todosJogos = [...equipe.jogosCasa, ...equipe.jogosFora].filter(
          (j) => j.status === 'FINALIZADO',
        );

        let pontos = 0;
        let v = 0,
          e = 0,
          d = 0,
          gp = 0,
          gc = 0;

        todosJogos.forEach((jogo) => {
          const isCasa = jogo.equipeCasaId === equipe.id;
          const golsPro = isCasa ? jogo.golsCasa : jogo.golsFora;
          const golsContra = isCasa ? jogo.golsFora : jogo.golsCasa;

          gp += golsPro;
          gc += golsContra;

          if (golsPro > golsContra) {
            pontos += 3;
            v += 1;
          } else if (golsPro === golsContra) {
            pontos += 1;
            e += 1;
          } else {
            d += 1;
          }
        });

        return {
          id: equipe.id,
          nome: equipe.nome,
          slug: equipe.slug,
          jogos: todosJogos.length,
          pontos,
          v,
          e,
          d,
          gp,
          gc,
          sg: gp - gc,
        };
      },
    )
    .sort(
      (
        a: {
          pontos: number;
          sg: number;
          gp: number;
          nome: string;
        },
        b: {
          pontos: number;
          sg: number;
          gp: number;
          nome: string;
        },
      ) =>
        b.pontos - a.pontos ||
        b.sg - a.sg ||
        b.gp - a.gp ||
        a.nome.localeCompare(b.nome),
    );

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
        🏆 Classificação Geral
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border rounded shadow-sm overflow-hidden">
          <thead className="bg-blue-600 text-white text-xs">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Equipe</th>
              <th className="px-2 py-2 text-center">Pts</th>
              <th className="px-2 py-2 text-center">J</th>
              <th className="px-2 py-2 text-center">V</th>
              <th className="px-2 py-2 text-center">E</th>
              <th className="px-2 py-2 text-center">D</th>
              <th className="px-2 py-2 text-center">GP</th>
              <th className="px-2 py-2 text-center">GC</th>
              <th className="px-2 py-2 text-center">SG</th>
            </tr>
          </thead>
          <tbody className="bg-white text-xs md:text-sm">
            {tabela.map(
              (
                time: {
                  id: string;
                  nome: string;
                  slug: string;
                  jogos: number;
                  pontos: number;
                  v: number;
                  e: number;
                  d: number;
                  gp: number;
                  gc: number;
                  sg: number;
                },
                index: number,
              ) => (
                <tr
                  key={time.id}
                  className={index === 0 ? 'bg-yellow-50 font-bold' : ''}
                >
                  <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                  <td className="px-4 py-2">{time.nome}</td>
                  <td className="px-2 py-2 text-center">{time.pontos}</td>
                  <td className="px-2 py-2 text-center">{time.jogos}</td>
                  <td className="px-2 py-2 text-center">{time.v}</td>
                  <td className="px-2 py-2 text-center">{time.e}</td>
                  <td className="px-2 py-2 text-center">{time.d}</td>
                  <td className="px-2 py-2 text-center">{time.gp}</td>
                  <td className="px-2 py-2 text-center">{time.gc}</td>
                  <td className="px-2 py-2 text-center">{time.sg}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {tabela.every((t: { jogos: number }) => t.jogos === 0) && (
        <p className="text-center text-gray-500 mt-6">
          Nenhum jogo finalizado ainda. Acompanhe aqui os resultados em breve!
        </p>
      )}
    </main>
  );
}
