import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Suspense } from 'react';

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

      {/* 🔍 Filtro por equipe */}
      {equipesUnicas.length > 1 && (
        <div className="mb-6 flex justify-end">
          <Suspense fallback={null}>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por equipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as equipes</SelectItem>
                {equipesUnicas.map((nome) => (
                  <SelectItem key={nome} value={nome}>
                    {nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Suspense>
        </div>
      )}

      {artilheiros.length === 0 ? (
        <p className="text-gray-500 text-center">
          Nenhum gol registrado até o momento.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded shadow-sm overflow-hidden">
            <thead className="bg-blue-600 text-white text-xs uppercase">
              <tr>
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Jogador</th>
                <th className="p-2 text-center">Gols</th>
              </tr>
            </thead>
            <tbody>
              {artilheiros.map((jogador, idx) => (
                <tr
                  key={jogador.id}
                  className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="p-3 font-semibold">{idx + 1}</td>
                  <td className="p-3 flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      {jogador.fotoUrl ? (
                        <AvatarImage src={jogador.fotoUrl} alt={jogador.nome} />
                      ) : (
                        <AvatarFallback>
                          <User className="w-4 h-4 text-gray-400" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium">{jogador.nome}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        {jogador.equipeLogo && (
                          <Image
                            src={jogador.equipeLogo}
                            alt={jogador.equipe}
                            width={16}
                            height={16}
                            className="rounded-full border"
                          />
                        )}
                        {jogador.equipe}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <Badge
                      variant="secondary"
                      className="bg-blue-600 text-white text-xs px-2 py-1"
                    >
                      ⚽ {jogador.gols}
                    </Badge>
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
