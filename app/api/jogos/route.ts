import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  equipeCasaId: z.string().uuid(),
  equipeForaId: z.string().uuid(),
  data: z.string(), // ISO format
  local: z.string(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { equipeCasaId, equipeForaId, data, local } = parsed.data

    const novoJogo = await prisma.jogo.create({
      data: {
        equipeCasaId,
        equipeForaId,
        data: new Date(data),
        local,
        golsCasa: 0,
        golsFora: 0,
      },
    })

    return NextResponse.json(novoJogo, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar jogo:', error)
    return NextResponse.json({ error: 'Erro interno ao criar jogo.' }, { status: 500 })
  }
}
