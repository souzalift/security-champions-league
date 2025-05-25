import FiltroArtilheiros from '@/components/FiltroArtilheiros';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function ArtilhariaPage() {
  const jogadores = await prisma.jogador.findMany({
    include: {
      equipe: true,
      gols: true,
    },
  });

  const equipesUnicas = Array.from(
    new Set(jogadores.map((j) => j.equipe.nome)),
  ).sort();

  const artilheiros = jogadores
    .map((jogador) => ({
      id: jogador.id,
      nome: jogador.nome,
      equipe: jogador.equipe.nome,
      equipeLogo: jogador.equipe.logoUrl || null,
      fotoUrl: jogador.fotoUrl || null,
      gols: jogador.gols.length,
    }))
    .filter((j) => j.gols > 0)
    .sort((a, b) => b.gols - a.gols || a.nome.localeCompare(b.nome));

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center flex items-center justify-center gap-2">
        <Image
          src="/golden-boot.png"
          alt="Chuteira de Ouro"
          width={32}
          height={32}
        />
        Artilharia do Torneio
      </h1>

      {/* Componente de filtro */}
      <FiltroArtilheiros equipes={equipesUnicas} artilheiros={artilheiros} />
    </main>
  );
}
