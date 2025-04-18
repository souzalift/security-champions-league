import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default async function EquipesPage() {
  const equipes = await prisma.equipe.findMany({
    include: {
      jogadores: {
        orderBy: { numero: 'asc' },
      },
    },
    orderBy: { nome: 'asc' },
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8 text-blue-700 text-center">
        👥 Equipes Participantes
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {equipes.map((equipe) => (
          <div
            key={equipe.id}
            className="bg-white border rounded-lg shadow-sm p-4 text-center"
          >
            <Image
              src={equipe.logoUrl || '/avatar-time.png'}
              width={80}
              height={80}
              alt={equipe.nome}
              className="mx-auto mb-3 rounded-full border object-cover"
            />

            <h2 className="text-lg font-semibold text-blue-700">
              {equipe.nome}
            </h2>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 text-sm font-medium"
                >
                  Ver elenco
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-3xl w-full">
                <h3 className="text-lg font-bold mb-4 text-center text-blue-700">
                  {equipe.nome} – Elenco
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {equipe.jogadores.map((jogador) => (
                    <div
                      key={jogador.id}
                      className="flex items-center gap-4 border p-3 rounded"
                    >
                      {jogador.fotoUrl ? (
                        <Image
                          src={jogador.fotoUrl}
                          width={50}
                          height={50}
                          className="rounded-full object-cover border"
                          alt={jogador.nome}
                        />
                      ) : (
                        <div className="w-[50px] h-[50px] bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
                          Sem Foto
                        </div>
                      )}

                      <div className="flex flex-col">
                        <span className="font-semibold">{jogador.nome}</span>
                        <span className="text-gray-500 text-xs">
                          #{jogador.numero} – {jogador.posicao}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </main>
  );
}
