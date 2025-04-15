import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const schema = z.object({
  nome: z.string(),
  contato: z.string(),
  capitao: z.string(),
  aceite: z.boolean(),
  jogadores: z.array(
    z.object({
      nome: z.string(),
      posicao: z.string(),
      numero: z.number(),
    })
  ),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  }

  const { nome, contato, capitao, aceite, jogadores } = parsed.data

  const equipe = await prisma.inscricaoEquipe.create({
    data: {
      nome,
      contato,
      capitao,
      aceiteRegulamento: aceite,
      jogadores: {
        create: jogadores,
      },
    },
  })

  return NextResponse.json({ success: true, id: equipe.id })
}
