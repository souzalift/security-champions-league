import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json()

  const schema = z.object({
    golsCasa: z.number().min(0),
    golsFora: z.number().min(0),
  })

  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { golsCasa, golsFora } = parsed.data

  await prisma.jogo.update({
    where: { id: params.id },
    data: {
      golsCasa,
      golsFora,
      status: 'FINALIZADO',
    },
  })

  return NextResponse.json({ status: 'ok' })
}
