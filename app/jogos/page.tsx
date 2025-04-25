import { ListaJogos } from '@/components/ListaJogos';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function JogosPage() {
  const jogos = await prisma.jogo.findMany({
    include: {
      equipeCasa: true,
      equipeFora: true,
      gols: {
        include: { jogador: true },
      },
    },
    orderBy: { data: 'asc' },
  });

  const jogosSerializados = jogos.map((jogo) => ({
    id: jogo.id,
    data: jogo.data.toISOString(),
    local: jogo.local,
    status: jogo.status,
    golsCasa: jogo.golsCasa,
    golsFora: jogo.golsFora,
    equipeCasa: {
      id: jogo.equipeCasa.id,
      nome: jogo.equipeCasa.nome,
    },
    equipeFora: {
      id: jogo.equipeFora.id,
      nome: jogo.equipeFora.nome,
    },
    gols: jogo.gols.map((g) => ({
      id: g.id,
      jogadorId: g.jogadorId,
      jogador: {
        nome: g.jogador.nome,
      },
      minuto: g.minuto ?? undefined,
    })),
  }));

  return <ListaJogos jogos={jogosSerializados} />;
}
