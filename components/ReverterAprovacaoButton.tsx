'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
  inscricaoId: string;
};

export default function ReverterAprovacaoButton({ inscricaoId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReverter = async () => {
    setLoading(true);

    const res = await fetch(`/api/admin/reverter/${inscricaoId}`, {
      method: 'DELETE',
    });

    const json = await res.json();
    setLoading(false);

    if (res.ok) {
      toast.success('✅ Equipe removida com sucesso.');
      setOpen(false);
      window.location.reload();
    } else {
      toast.error(json.error || 'Erro ao remover equipe.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-red-600 text-sm hover:underline"
        >
          🔄 Reverter aprovação
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover equipe?</DialogTitle>
          <DialogDescription>
            Esta ação irá reverter a inscrição da equipe. Deseja continuar?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleReverter}
            disabled={loading}
          >
            {loading ? 'Removendo...' : 'Remover equipe'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
