import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const schema = z.object({
  equipeCasaId: z.string().uuid(),
  equipeForaId: z.string().uuid(),
  data: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data inválida',
  }),
  local: z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }

  const { equipeCasaId, equipeForaId, data, local } = parsed.data

  if (equipeCasaId === equipeForaId) {
    return NextResponse.json({ error: 'Uma equipe não pode jogar contra ela mesma' }, { status: 400 })
  }

  const jogo = await prisma.jogo.create({
    data: {
      equipeCasaId,
      equipeForaId,
      data: new Date(data),
      local,
      status: 'AGENDADO',
      golsCasa: 0,
      golsFora: 0,
    },
    include: {
      equipeCasa: true,
      equipeFora: true,
    },
  })

  return NextResponse.json(jogo, { status: 201 })
}
