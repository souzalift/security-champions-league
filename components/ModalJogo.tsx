'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

type Gol = {
  id: string;
  jogador: {
    nome: string;
  };
  minuto?: number;
  jogadorId: string;
};

type Props = {
  jogoId: string;
  equipeCasa: string;
  equipeFora: string;
  golsCasa: number;
  golsFora: number;
  local: string;
  dataFormatada: string;
  gols: Gol[];
};

export function ModalJogo({
  jogoId,
  equipeCasa,
  equipeFora,
  golsCasa,
  golsFora,
  local,
  dataFormatada,
  gols,
}: Props) {
  const [open, setOpen] = useState(false);

  const golsCasaEquipe = gols.filter((g) => g.jogadorId.startsWith('C-')); // você pode mudar isso para filtrar com base na equipe real
  const golsForaEquipe = gols.filter((g) => g.jogadorId.startsWith('F-'));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-blue-600 text-sm underline hover:text-blue-800">
        Ver detalhes
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full">
        <h3 className="text-xl font-bold mb-2">
          {equipeCasa} {golsCasa} x {golsFora} {equipeFora}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          📍 {local} — {dataFormatada}
        </p>

        <div className="space-y-2 text-sm">
          {gols.length === 0 ? (
            <p className="text-gray-500">Nenhum gol registrado.</p>
          ) : (
            <ul className="space-y-1">
              {gols.map((g) => (
                <li key={g.id}>
                  ⚽ {g.jogador.nome}{' '}
                  {g.minuto !== undefined && (
                    <span className="text-gray-500">(min {g.minuto})</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
