'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';

type Jogador = {
  id: string;
  nome: string;
  equipeId: string;
};

type Gol = {
  jogadorId: string;
  minuto?: number;
};

type Props = {
  jogo: {
    id: string;
    equipeCasa: { id: string; nome: string };
    equipeFora: { id: string; nome: string };
    golsCasa: number;
    golsFora: number;
  };
};

export function EditarJogoForm({ jogo }: Props) {
  const [golsCasa, setGolsCasa] = useState(jogo.golsCasa);
  const [golsFora, setGolsFora] = useState(jogo.golsFora);
  const [gols, setGols] = useState<Gol[]>([]);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function buscarJogadores() {
      const res = await fetch('/api/jogadores');
      const data = await res.json();
      setJogadores(data);
    }

    buscarJogadores();
  }, []);

  const jogadoresCasa = jogadores.filter(
    (j) => j.equipeId === jogo.equipeCasa.id,
  );
  const jogadoresFora = jogadores.filter(
    (j) => j.equipeId === jogo.equipeFora.id,
  );

  function adicionarGol() {
    setGols([...gols, { jogadorId: '', minuto: undefined }]);
  }

  function atualizarGol<K extends keyof Gol>(
    index: number,
    key: K,
    value: Gol[K],
  ) {
    const novos = [...gols];
    novos[index][key] = value;
    setGols(novos);
  }

  function removerGol(index: number) {
    setGols(gols.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/jogos/${jogo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ golsCasa, golsFora, gols }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success('Resultado atualizado com sucesso!');
      router.push('/admin/jogos');
      router.refresh();
    } else {
      const json = await res.json();
      toast.error(json.error || 'Erro ao salvar resultado');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white p-6 rounded shadow max-w-3xl"
    >
      <h2 className="text-xl font-bold text-blue-700">Placar da Partida</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="golsCasa">{jogo.equipeCasa.nome}</Label>
          <Input
            id="golsCasa"
            type="number"
            min={0}
            value={golsCasa}
            onChange={(e) => setGolsCasa(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="golsFora">{jogo.equipeFora.nome}</Label>
          <Input
            id="golsFora"
            type="number"
            min={0}
            value={golsFora}
            onChange={(e) => setGolsFora(Number(e.target.value))}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-medium text-gray-700">
            ⚽ Gols dos Jogadores
          </h3>
          <Button
            type="button"
            variant="secondary"
            onClick={adicionarGol}
            size="sm"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            Adicionar Gol
          </Button>
        </div>

        {gols.length === 0 && (
          <p className="text-sm text-gray-500">Nenhum gol adicionado ainda.</p>
        )}

        {gols.map((gol, index) => (
          <div
            key={index}
            className="flex items-end gap-3 border p-3 rounded-md"
          >
            <div className="flex-1">
              <Label className="text-xs text-gray-500">Jogador</Label>
              <Select
                value={gol.jogadorId}
                onValueChange={(value) =>
                  atualizarGol(index, 'jogadorId', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o jogador" />
                </SelectTrigger>
                <SelectContent>
                  {[...jogadoresCasa, ...jogadoresFora].map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.nome} –{' '}
                      <span className="text-gray-400 text-xs">
                        {j.equipeId === jogo.equipeCasa.id
                          ? jogo.equipeCasa.nome
                          : jogo.equipeFora.nome}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-24">
              <Label className="text-xs text-gray-500">Minuto</Label>
              <Input
                type="number"
                min={0}
                value={gol.minuto ?? ''}
                onChange={(e) =>
                  atualizarGol(index, 'minuto', Number(e.target.value))
                }
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removerGol(index)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Resultado'}
        </Button>
      </div>
    </form>
  );
}
