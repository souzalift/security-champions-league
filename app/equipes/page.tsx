import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
                <DialogContent className="w-full max-h-[85vh] overflow-y-auto px-4 md:px-6">
                  <DialogTitle className="text-lg font-bold mb-4 text-center text-blue-700">
                    {equipe.nome} - Elenco
                  </DialogTitle>
                  {equipe.jogadores.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">
                      Nenhum jogador cadastrado.
                    </p>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-4 md:overflow-x-auto overflow-y-auto max-h-[60vh] px-1 pb-2">
                      {equipe.jogadores.map((jogador) => (
                        <Card
                          key={jogador.id}
                          className="min-w-[180px] flex flex-col items-center justify-center p-4 text-center shadow-sm"
                        >
                          {jogador.fotoUrl ? (
                            <Image
                              src={jogador.fotoUrl}
                              alt={jogador.nome}
                              width={96}
                              height={96}
                              className="w-24 h-24 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 border">
                              <User className="w-8 h-8" />
                            </div>
                          )}
                          <div className="mt-2">
                            <p className="font-semibold text-sm truncate">
                              {jogador.nome}
                            </p>
                            <p className="text-xs text-gray-500">
                              #{jogador.numero} – {jogador.posicao}
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
