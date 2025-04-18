import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  nome: z.string(),
  capitao: z.string(),
  contato: z.string(),
  logoUrl: z.string().url().optional().nullable(),
  jogadores: z.array(
    z.object({
      id: z.string(),
      nome: z.string(),
      numero: z.number(),
      posicao: z.string(),
      fotoUrl: z.string().url().optional().nullable(),
    }),
  ),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const equipeId = params.id;
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message },
      { status: 400 },
    );
  }

  const { nome, capitao, contato, logoUrl, jogadores } = parsed.data;

  try {
    // Atualiza os dados da equipe
    await prisma.inscricaoEquipe.update({
      where: { id: equipeId },
      data: {
        nome,
        capitao,
        contato,
        logoUrl: logoUrl ?? null,
      },
    });

    // Atualiza os jogadores um por um
    for (const jogador of jogadores) {
      await prisma.inscricaoJogador.update({
        where: { id: jogador.id },
        data: {
          nome: jogador.nome,
          numero: jogador.numero,
          posicao: jogador.posicao,
          fotoUrl: jogador.fotoUrl ?? null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PATCH /admin/equipe/:id]', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar equipe.' },
      { status: 500 },
    );
  }
}
