'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';

type Props = {
  equipeId: string;
};

export function RestaurarEquipeButton({ equipeId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleRestaurar = async () => {
    try {
      const res = await fetch(`/api/admin/equipes/${equipeId}/restaurar`, {
        method: 'PATCH',
      });

      if (res.ok) {
        toast.success('Equipe restaurada com sucesso!');
        location.reload();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erro ao restaurar equipe.');
      }
    } catch {
      toast.error('Erro inesperado ao restaurar equipe.');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(handleRestaurar)}
    >
      🔁 Restaurar
    </Button>
  );
}
