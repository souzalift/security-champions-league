import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  await prisma.inscricaoEquipe.delete({
    where: { id: params.id },
  });

  return NextResponse.redirect(new URL('/admin/equipes-rejeitadas', req.url));
}
