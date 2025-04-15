/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/prisma';

type Estatistica = {
  equipeId: string;
  nome: string;
  pontos: number;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golsPro: number;
  golsContra: number;
  saldo: number;
};

function calcularClassificacao(jogos: any[], equipes: any[]): Estatistica[] {
  const mapa = new Map<string, Estatistica>();

  for (const equipe of equipes) {
    mapa.set(equipe.id, {
      equipeId: equipe.id,
      nome: equipe.nome,
      pontos: 0,
      jogos: 0,
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      golsPro: 0,
      golsContra: 0,
      saldo: 0,
    });
  }

  for (const jogo of jogos) {
    if (!jogo.status || jogo.status !== 'FINALIZADO') continue;

    const casa = mapa.get(jogo.equipeCasaId)!;
    const fora = mapa.get(jogo.equipeForaId)!;

    casa.jogos++;
    fora.jogos++;

    casa.golsPro += jogo.golsCasa;
    casa.golsContra += jogo.golsFora;

    fora.golsPro += jogo.golsFora;
    fora.golsContra += jogo.golsCasa;

    if (jogo.golsCasa > jogo.golsFora) {
      casa.vitorias++;
      casa.pontos += 3;
      fora.derrotas++;
    } else if (jogo.golsCasa < jogo.golsFora) {
      fora.vitorias++;
      fora.pontos += 3;
      casa.derrotas++;
    } else {
      casa.empates++;
      fora.empates++;
      casa.pontos += 1;
      fora.pontos += 1;
    }
  }

  const tabela = Array.from(mapa.values());

  tabela.forEach((e) => {
    e.saldo = e.golsPro - e.golsContra;
  });

  return tabela.sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (b.saldo !== a.saldo) return b.saldo - a.saldo;
    if (b.golsPro !== a.golsPro) return b.golsPro - a.golsPro;
    return a.nome.localeCompare(b.nome);
  });
}

export default async function Page() {
  const equipes = await prisma.equipe.findMany();
  const jogos = await prisma.jogo.findMany({ where: { status: 'FINALIZADO' } });

  const classificacao = calcularClassificacao(jogos, equipes);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Classificação Geral</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2 text-left">Equipe</th>
              <th className="p-2">P</th>
              <th className="p-2">J</th>
              <th className="p-2">V</th>
              <th className="p-2">E</th>
              <th className="p-2">D</th>
              <th className="p-2">GP</th>
              <th className="p-2">GC</th>
              <th className="p-2">SG</th>
            </tr>
          </thead>
          <tbody>
            {classificacao.map((equipe, idx) => (
              <tr key={equipe.equipeId} className="text-center border-t">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2 text-left">{equipe.nome}</td>
                <td className="p-2">{equipe.pontos}</td>
                <td className="p-2">{equipe.jogos}</td>
                <td className="p-2">{equipe.vitorias}</td>
                <td className="p-2">{equipe.empates}</td>
                <td className="p-2">{equipe.derrotas}</td>
                <td className="p-2">{equipe.golsPro}</td>
                <td className="p-2">{equipe.golsContra}</td>
                <td className="p-2">{equipe.saldo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
// Este código é uma página Next.js que exibe a classificação geral de um campeonato.
// Ele busca os dados das equipes e jogos finalizados do banco de dados usando Prisma.
