'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { formatInTimeZone } from 'date-fns-tz';

type Props = {
  equipes: { id: string; nome: string }[];
};

export default function FormNovoJogo({ equipes }: Props) {
  const router = useRouter();

  const [data, setData] = useState('');
  const [local, setLocal] = useState('');
  const [casa, setCasa] = useState('');
  const [fora, setFora] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (casa === fora) {
      toast.error('As equipes devem ser diferentes.');
      return;
    }

    setLoading(true);

    try {
      // Ajusta o valor de "data" para UTC
      const dataUtc = formatInTimeZone(
        data,
        'America/Sao_Paulo',
        "yyyy-MM-dd'T'HH:mm:ssXXX",
      );

      const res = await fetch('/api/jogos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipeCasaId: casa,
          equipeForaId: fora,
          data: dataUtc, // Envia a data ajustada para UTC
          local,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        toast.success('✅ Jogo criado com sucesso!');
        setTimeout(() => router.push('/jogos'), 1200);
      } else {
        toast.error(json.error || 'Erro ao criar jogo');
      }
    } catch {
      toast.error('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-lg font-bold text-blue-700 text-center">
        📅 Novo Jogo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Equipe Casa</Label>
          <Select value={casa} onValueChange={setCasa}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a equipe da casa" />
            </SelectTrigger>
            <SelectContent>
              {equipes.map((eq) => (
                <SelectItem key={eq.id} value={eq.id}>
                  {eq.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Equipe Fora</Label>
          <Select value={fora} onValueChange={setFora}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a equipe visitante" />
            </SelectTrigger>
            <SelectContent>
              {equipes.map((eq) => (
                <SelectItem key={eq.id} value={eq.id}>
                  {eq.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Data e Hora</Label>
          <Input
            type="datetime-local"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Local</Label>
          <Input
            type="text"
            placeholder="Ex: Quadra Coberta A"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Jogo'}
        </Button>
      </form>
    </Card>
  );
}
