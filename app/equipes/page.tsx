import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

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

      {equipes.length === 0 ? (
        <p className="text-center text-gray-500">
          Nenhuma equipe confirmada até o momento. Aguarde atualizações!
        </p>
      ) : (
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
                className="mx-auto mb-3 object-cover"
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

                <DialogContent className="sm:max-w-xl md:max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto">
                  <h3 className="text-lg font-bold mb-4 text-center text-blue-700">
                    {equipe.nome} – Elenco
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {equipe.jogadores.map((jogador) => (
                      <div
                        key={jogador.id}
                        className="flex items-center gap-3 border rounded-md px-4 py-2 bg-white shadow-sm hover:bg-gray-50 transition"
                      >
                        {jogador.fotoUrl ? (
                          <Image
                            src={jogador.fotoUrl}
                            alt={jogador.nome}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover border"
                          />
                        ) : (
                          <div
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 border"
                            aria-label="Jogador sem foto"
                          >
                            <User className="w-5 h-5" />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold leading-none">
                            {jogador.nome}
                          </p>
                          <p className="text-xs text-gray-500">
                            #{jogador.numero} – {jogador.posicao}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
