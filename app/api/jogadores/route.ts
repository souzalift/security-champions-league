import { prisma } from '@/lib/prisma'

export async function GET() {
  const jogadores = await prisma.jogador.findMany({
    select: { id: true, nome: true, equipeId: true },
    orderBy: { nome: 'asc' },
  })

  return Response.json(jogadores)
}
