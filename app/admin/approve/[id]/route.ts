import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const inscricao = await prisma.inscricaoEquipe.findUnique({
    where: { id },
    include: {
      jogadores: {
        select: {
          nome: true,
          numero: true,
          posicao: true,
          fotoUrl: true, // <- adicionado aqui
        },
      },
    },
  });

  if (!inscricao) {
    return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 });
  }

  await prisma.equipe.create({
    data: {
      nome: inscricao.nome,
      contato: inscricao.contato,
      capitao: inscricao.capitao,
      slug: inscricao.nome.toLowerCase().replace(/\s+/g, '-'),
      aceiteRegulamento: inscricao.aceiteRegulamento,
      logoUrl: inscricao.logoUrl ?? null,
      jogadores: {
        create: inscricao.jogadores.map((j) => ({
          nome: j.nome,
          numero: j.numero,
          posicao: j.posicao,
          fotoUrl: j.fotoUrl ?? null,
        })),
      },
    },
  });

  await prisma.inscricaoEquipe.update({
    where: { id },
    data: { status: 'APROVADA' },
  });

  return NextResponse.redirect(new URL('/admin/dashboard', req.url));
}
