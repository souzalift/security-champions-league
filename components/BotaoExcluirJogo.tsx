'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function BotaoExcluirJogo({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmar = confirm('Tem certeza que deseja excluir este jogo?');

    if (!confirmar) return;

    const res = await fetch(`/api/admin/jogos/${id}/delete`, {
      method: 'DELETE',
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert('Erro ao excluir jogo.');
    }
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      className="ml-2"
      onClick={handleDelete}
    >
      <Trash2 className="w-4 h-4 mr-1" />
      Excluir
    </Button>
  );
}
