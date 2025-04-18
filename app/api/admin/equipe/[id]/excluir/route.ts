import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Excluir jogadores relacionados primeiro
    await prisma.inscricaoJogador.deleteMany({
      where: { inscricaoEquipeId: id },
    });

    // Em seguida, excluir a equipe
    await prisma.inscricaoEquipe.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /admin/equipe/:id/excluir]', error);
    return NextResponse.json(
      { error: 'Erro ao excluir equipe.' },
      { status: 500 }
    );
  }
}
