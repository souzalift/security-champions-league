'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

type Jogador = {
  id: string;
  nome: string;
  equipe: string;
  equipeLogo: string | null;
  fotoUrl: string | null;
  gols: number;
};

type Props = {
  equipes: string[];
  artilheiros: Jogador[];
};

export default function FiltroArtilheiros({ equipes, artilheiros }: Props) {
  const [equipeSelecionada, setEquipeSelecionada] = useState('todas');

  // Filtrar os artilheiros com base na equipe selecionada
  const artilheirosFiltrados =
    equipeSelecionada === 'todas'
      ? artilheiros
      : artilheiros.filter((j) => j.equipe === equipeSelecionada);

  return (
    <div>
      {/* Filtro por equipe */}
      {equipes.length > 1 && (
        <div className="mb-6 flex justify-end">
          <Select
            value={equipeSelecionada}
            onValueChange={(value) => setEquipeSelecionada(value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por equipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as equipes</SelectItem>
              {equipes.map((nome) => (
                <SelectItem key={nome} value={nome}>
                  {nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Tabela de artilheiros */}
      {artilheirosFiltrados.length === 0 ? (
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
              {artilheirosFiltrados.map((jogador, idx) => (
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
                          <img
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
                    <span className="bg-blue-600 hover:bg-blue-800 text-white text-xs px-2 py-1 rounded">
                      ⚽ {jogador.gols}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
