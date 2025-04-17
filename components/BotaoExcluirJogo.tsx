'use client';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function BotaoExcluirJogo({ id }: { id: string }) {
  const router = useRouter();

  async function excluir() {
    const res = await fetch(`/api/admin/jogos/${id}/delete`, {
      method: 'DELETE',
    });

    if (res.ok) {
      toast.success('Jogo excluído com sucesso!');
      router.refresh();
    } else {
      toast.error('Erro ao excluir o jogo.');
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash2 className="w-4 h-4 mr-1" />
          Excluir
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja realmente excluir?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. O jogo será removido
            permanentemente do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={excluir}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirmar Exclusão
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
