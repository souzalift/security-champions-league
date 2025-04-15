import { prisma } from '@/lib/prisma';
import FormEditarResultado from './form';

export default async function EditarJogoPage({
  params,
}: {
  params: { id: string };
}) {
  const jogo = await prisma.jogo.findUnique({
    where: { id: params.id },
    include: {
      equipeCasa: true,
      equipeFora: true,
    },
  });

  if (!jogo) return <p className="text-center py-10">Jogo não encontrado.</p>;

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-blue-700 mb-6">
        ✏️ Editar Resultado
      </h1>
      <FormEditarResultado jogo={jogo} />
    </main>
  );
}
