import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  await prisma.inscricaoEquipe.update({
    where: { id: params.id },
    data: { status: 'PENDENTE' },
  });

  return NextResponse.redirect(new URL('/admin/equipes-rejeitadas', req.url));
}
