import { prisma } from '@/lib/prisma';
import FormNovoJogo from './form';

export default async function NovoJogoPage() {
  const equipes = await prisma.equipe.findMany({
    orderBy: { nome: 'asc' },
  });

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <FormNovoJogo equipes={equipes} />
    </main>
  );
}
