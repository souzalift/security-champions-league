import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const inscricaoId = params.id

  const inscricao = await prisma.inscricaoEquipe.findUnique({
    where: { id: inscricaoId },
    include: { jogadores: true },
  })

  if (!inscricao || inscricao.status !== 'APROVADA') {
    return NextResponse.json({ error: 'Inscrição não aprovada.' }, { status: 400 })
  }

  // Procurar a equipe criada a partir dessa inscrição
  const equipe = await prisma.equipe.findFirst({
    where: {
      nome: inscricao.nome,
      capitao: inscricao.capitao,
      contato: inscricao.contato,
    },
  })

  if (!equipe) {
    return NextResponse.json({ error: 'Equipe não encontrada.' }, { status: 404 })
  }

  // Remove equipe e jogadores
  await prisma.jogador.deleteMany({
    where: { equipeId: equipe.id },
  })

  await prisma.equipe.delete({
    where: { id: equipe.id },
  })

  // Marca inscrição como pendente novamente (ou crie um status REVERTIDA se preferir)
  await prisma.inscricaoEquipe.update({
    where: { id: inscricao.id },
    data: { status: 'PENDENTE' },
  })

  return NextResponse.json({ success: true })
}
