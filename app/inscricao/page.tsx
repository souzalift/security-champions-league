'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Image from 'next/image';
import { UploadFoto } from '@/components/UploadButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Jogador = {
  nome: string;
  posicao: string;
  numero: number;
  fotoUrl?: string;
};

export default function InscricaoPage() {
  const router = useRouter();

  const [equipe, setEquipe] = useState({
    nome: '',
    contato: '',
    capitao: '',
    aceite: false,
    logoUrl: '',
  });

  const [jogadores, setJogadores] = useState<Jogador[]>([
    { nome: '', posicao: '', numero: 1 },
  ]);

  const [loading, setLoading] = useState(false);

  const handleChange = <K extends keyof Jogador>(
    index: number,
    field: K,
    value: Jogador[K],
  ) => {
    const updated = [...jogadores];
    updated[index][field] = value;
    setJogadores(updated);
  };

  const addJogador = () => {
    if (jogadores.length < 10)
      setJogadores([...jogadores, { nome: '', posicao: '', numero: 0 }]);
  };

  const removeJogador = (index: number) => {
    if (jogadores.length > 8) {
      setJogadores(jogadores.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numeros = jogadores.map((j) => j.numero);
    const numerosRepetidos = numeros.filter(
      (num, i, arr) => arr.indexOf(num) !== i,
    );

    if (numerosRepetidos.length > 0) {
      toast.error('Não é permitido dois jogadores com o mesmo número.');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/inscricao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...equipe, jogadores }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success('Inscrição enviada com sucesso!', {
        duration: 2500,
      });
      setTimeout(() => {
        router.push('/');
      }, 2500);
    } else {
      const json = await res.json();
      toast.error(json.error || 'Erro ao enviar inscrição.');
    }
  };

  return (
    <main className=" container max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">
        📝 Inscrição de Equipe
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome da equipe</Label>
              <Input
                placeholder="Ex: Guardiões da Rede"
                value={equipe.nome}
                onChange={(e) => setEquipe({ ...equipe, nome: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Nome do capitão</Label>
              <Input
                placeholder="Ex: João Silva"
                value={equipe.capitao}
                onChange={(e) =>
                  setEquipe({ ...equipe, capitao: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Contato (WhatsApp ou e-mail)</Label>
              <Input
                placeholder="(71) 99999-9999"
                value={equipe.contato}
                onChange={(e) =>
                  setEquipe({ ...equipe, contato: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Logo da equipe (opcional)</Label>
              <UploadFoto
                onUploadComplete={(url) =>
                  setEquipe({ ...equipe, logoUrl: url })
                }
              />

              {equipe.logoUrl && (
                <Image
                  src={equipe.logoUrl}
                  alt="Preview da logo"
                  width={24}
                  height={24}
                  className="w-24 h-24 rounded border mt-2 object-cover"
                />
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-blue-600">
            Jogadores ({jogadores.length}/10)
          </h2>

          {jogadores.map((jogador, index) => (
            <div
              key={index}
              className="grid grid-cols-3 md:grid-cols-5 gap-4 items-start"
            >
              <div>
                <Label>Nome</Label>
                <Input
                  placeholder="Nome do jogador"
                  value={jogador.nome}
                  onChange={(e) => handleChange(index, 'nome', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Posição</Label>
                <Select
                  value={jogador.posicao}
                  onValueChange={(value) =>
                    handleChange(index, 'posicao', value)
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Posição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Goleiro">Goleiro</SelectItem>
                    <SelectItem value="Fixo">Fixo</SelectItem>
                    <SelectItem value="Ala">Ala</SelectItem>
                    <SelectItem value="Pivô">Pivô</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="max-w-[60px]">
                <Label>Número</Label>
                <Input
                  type="number"
                  placeholder="Ex: 10"
                  value={jogador.numero}
                  onChange={(e) =>
                    handleChange(index, 'numero', Number(e.target.value))
                  }
                  required
                />
              </div>
              <div className="col-span-3 md:col-span-2 flex ml-5">
                <Label>Foto do Jogador (opcional)</Label>
                <UploadFoto
                  onUploadComplete={(url) =>
                    handleChange(index, 'fotoUrl', url)
                  }
                />
                {jogador.fotoUrl && (
                  <Image
                    width={150}
                    height={150}
                    src={jogador.fotoUrl}
                    alt={`Foto do jogador ${jogador.nome}`}
                    className="w-12 h-1 mt-2 rounded-full object-cover border"
                  />
                )}
              </div>

              {index >= 8 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeJogador(index)}
                >
                  Remover
                </Button>
              )}
            </div>
          ))}

          {jogadores.length < 10 && (
            <Button type="button" onClick={addJogador} variant="secondary">
              + Adicionar Jogador
            </Button>
          )}
        </Card>

        <Separator />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="aceite"
            checked={equipe.aceite}
            onChange={(e) => setEquipe({ ...equipe, aceite: e.target.checked })}
            required
          />
          <label htmlFor="aceite" className="text-sm">
            Li e aceito o{' '}
            <a
              href="/regulamento.pdf"
              target="_blank"
              className="underline text-blue-700"
            >
              regulamento oficial
            </a>
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Inscrição'}
        </Button>
      </form>
    </main>
  );
}
