import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const jogadorSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  numero: z.number().int().min(1),
  posicao: z.string().min(1),
  fotoUrl: z.string().url().optional().nullable(),
});

const schema = z.object({
  nome: z.string().min(1),
  capitao: z.string().min(1),
  contato: z.string().min(1),
  jogadores: z.array(jogadorSchema),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { nome, capitao, contato, jogadores } = parsed.data;

  try {
    // Atualiza equipe
    await prisma.inscricaoEquipe.update({
      where: { id: params.id },
      data: {
        nome,
        capitao,
        contato,
      },
    });

    // Atualiza jogadores
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
    console.error('Erro ao atualizar equipe:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar equipe' },
      { status: 500 }
    );
  }
}
