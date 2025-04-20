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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';

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
    logoUrl: null as string | null,
  });

  const [jogadores, setJogadores] = useState<Jogador[]>([
    { nome: '', posicao: '', numero: 1, fotoUrl: undefined },
  ]);

  const numerosDuplicados = jogadores
    .map((j) => j.numero)
    .filter((num, i, arr) => arr.indexOf(num) !== i);

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
    console.log(numerosRepetidos.length > 0);
    if (numerosRepetidos.length > 0) {
      toast.error('Não é permitido dois jogadores com o mesmo número.');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/inscricao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...equipe, jogadores }),
    });

    if (res.ok) {
      toast.success('Inscrição enviada com sucesso!');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      setLoading(false);
      const json = await res.json();
      toast.error(json.error || 'Erro ao enviar inscrição.');
    }
  };

  return (
    <main className="container max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">
        📝 Inscrição de Equipe
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Equipe */}
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
              <Label>Contato</Label>
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
                  alt="Logo preview"
                  width={100}
                  height={100}
                  className="w-24 h-24 mt-2 rounded object-cover border"
                />
              )}
            </div>
          </div>
        </Card>

        {/* Jogadores */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-blue-600">
            Jogadores ({jogadores.length}/10)
          </h2>

          {jogadores.map((jogador, index) => (
            <div
              key={index}
              className="grid grid-cols-2 md:grid-cols-7 gap-4 items-start"
            >
              <div className="col-span-1 md:col-span-2">
                <Label>Nome</Label>
                <Input
                  placeholder="Nome do jogador"
                  value={jogador.nome}
                  onChange={(e) => handleChange(index, 'nome', e.target.value)}
                  required
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <Label>Posição</Label>
                <Select
                  value={jogador.posicao}
                  onValueChange={(value) =>
                    handleChange(index, 'posicao', value)
                  }
                  required
                >
                  <SelectTrigger>
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
              <div>
                <Label>Número</Label>
                <Input
                  type="number"
                  value={jogador.numero}
                  onChange={(e) =>
                    handleChange(index, 'numero', Number(e.target.value))
                  }
                  className={
                    numerosDuplicados.includes(jogador.numero)
                      ? 'border-red-500'
                      : ''
                  }
                  required
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <Label>Foto (opcional)</Label>
                <div className="flex items-center gap-4">
                  <UploadFoto
                    onUploadComplete={(url) =>
                      handleChange(index, 'fotoUrl', url)
                    }
                  />
                  {jogador.fotoUrl && (
                    <Image
                      src={jogador.fotoUrl}
                      alt={`Foto de ${jogador.nome}`}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  )}
                </div>
              </div>

              {index >= 8 && (
                <div className="col-span-2 md:col-span-7 flex justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeJogador(index)}
                  >
                    Remover
                  </Button>
                </div>
              )}

              <div className="col-span-2 md:col-span-7">
                <Separator />
              </div>
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="/regulamento.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    regulamento oficial
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visualizar regulamento em PDF</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-green-500"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar Inscrição'}
        </Button>
      </form>
    </main>
  );
}
