import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  golsCasa: z.number(),
  golsFora: z.number(),
  gols: z
    .array(
      z.object({
        jogadorId: z.string().uuid(),
        minuto: z.number().optional(),
      })
    )
    .optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { golsCasa, golsFora, gols } = parsed.data;

    // Atualiza placar e status
    await prisma.jogo.update({
      where: { id: params.id },
      data: {
        golsCasa,
        golsFora,
        status: 'FINALIZADO',
      },
    });

    if (gols && gols.length > 0) {
      // Remove gols antigos
      await prisma.gol.deleteMany({ where: { jogoId: params.id } });

      // Cria novos gols
      await prisma.gol.createMany({
        data: gols.map((g) => ({
          jogadorId: g.jogadorId,
          jogoId: params.id,
          minuto: g.minuto,
        })),
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Erro ao atualizar jogo:', error);
    return NextResponse.json({ error: 'Erro interno ao atualizar jogo.' }, { status: 500 });
  }
}