'use client';

import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function BotaoEditarJogo({ id }: { id: string }) {
  const router = useRouter();

  return (
    <Button
      size="sm"
      variant="outline"
      className="text-sm gap-2"
      onClick={() => router.push(`/admin/jogos/${id}/editar`)}
    >
      <Pencil className="w-4 h-4" />
      Editar
    </Button>
  );
}
