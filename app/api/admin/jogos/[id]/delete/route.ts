import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Remove os gols do jogo primeiro
    await prisma.gol.deleteMany({
      where: { jogoId: params.id },
    })

    // Depois remove o jogo
    await prisma.jogo.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ status: 'deleted' })
  } catch (error) {
    console.error('Erro ao deletar jogo:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
