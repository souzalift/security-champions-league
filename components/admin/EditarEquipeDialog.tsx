'use client';

import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { UploadFoto } from '@/components/UploadButton';
import router from 'next/router';

type Jogador = {
  id: string;
  nome: string;
  numero: number;
  posicao: string;
  fotoUrl: string | null;
};

type Equipe = {
  id: string;
  nome: string;
  capitao: string;
  contato: string;
  logoUrl?: string | null;
  jogadores: Jogador[];
};

export function EditarEquipeDialog({ equipe }: { equipe: Equipe }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: equipe.nome,
    capitao: equipe.capitao,
    contato: equipe.contato,
    logoUrl: equipe.logoUrl || '',
  });

  const [jogadores, setJogadores] = useState<Jogador[]>(equipe.jogadores);
  const [loading, setLoading] = useState(false);

  const handleJogadorChange = (
    index: number,
    field: keyof Jogador,
    value: string | number,
  ) => {
    const updated = [...jogadores];
    updated[index][field] = value as never;
    setJogadores(updated);
  };

  const handleRemoveJogador = (index: number) => {
    const updated = jogadores.filter((_, i) => i !== index);
    setJogadores(updated);
  };

  const handleFotoUpload = (index: number, url: string) => {
    const updated = [...jogadores];
    updated[index].fotoUrl = url;
    setJogadores(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch(`/api/admin/equipe/${equipe.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        jogadores,
      }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success('Equipe atualizada com sucesso!');
      setOpen(false);
      router.reload();
    } else {
      const json = await res.json();
      toast.error(json.error || 'Erro ao atualizar equipe');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-4 h-4 mr-1" />
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-screen-md">
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-blue-700">✏️ Editar Equipe</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label>
              Nome da equipe
              <Input
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
              />
            </Label>
            <Label>
              Capitão
              <Input
                value={formData.capitao}
                onChange={(e) =>
                  setFormData({ ...formData, capitao: e.target.value })
                }
              />
            </Label>
            <Label className="md:col-span-2">
              Contato
              <Input
                value={formData.contato}
                onChange={(e) =>
                  setFormData({ ...formData, contato: e.target.value })
                }
              />
            </Label>

            <div className="md:col-span-2 space-y-2">
              <Label>Logo da equipe</Label>
              {formData.logoUrl && (
                <Image
                  src={formData.logoUrl}
                  alt="Logo da equipe"
                  width={80}
                  height={80}
                  className="rounded border object-cover"
                />
              )}
              <UploadFoto
                onUploadComplete={(url) =>
                  setFormData((prev) => ({ ...prev, logoUrl: url }))
                }
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2 text-blue-600">
              Jogadores ({jogadores.length})
            </h3>
            <div className="space-y-4">
              {jogadores.map((j, index) => (
                <div
                  key={j.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center border p-2 rounded"
                >
                  <Input
                    value={j.nome}
                    onChange={(e) =>
                      handleJogadorChange(index, 'nome', e.target.value)
                    }
                    placeholder="Nome"
                  />
                  <Input
                    type="number"
                    value={j.numero}
                    onChange={(e) =>
                      handleJogadorChange(
                        index,
                        'numero',
                        Number(e.target.value),
                      )
                    }
                    placeholder="Número"
                  />
                  <Input
                    value={j.posicao}
                    onChange={(e) =>
                      handleJogadorChange(index, 'posicao', e.target.value)
                    }
                    placeholder="Posição"
                  />
                  <div className="flex gap-2 items-center">
                    <UploadFoto
                      onUploadComplete={(res) => {
                        if (res && typeof res[0] === 'string') {
                          handleFotoUpload(index, res[0]);
                        }
                      }}
                    />
                    {j.fotoUrl && (
                      <Image
                        src={j.fotoUrl}
                        alt={`Foto do jogador ${j.nome}`}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveJogador(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
