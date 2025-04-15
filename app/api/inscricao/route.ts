import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const jogadorSchema = z.object({
  nome: z.string().min(1),
  posicao: z.string().min(1),
  numero: z.number().int().positive(),
})

const schema = z.object({
  nome: z.string().min(1),
  contato: z.string().min(1),
  capitao: z.string().min(1),
  aceiteRegulamento: z.boolean().refine(v => v === true, {
    message: 'É necessário aceitar o regulamento',
  }),
  jogadores: z.array(jogadorSchema).min(1),
})

export async function POST(req: Request) {
  const body = await req.json()

  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { nome, contato, capitao, jogadores, aceiteRegulamento } = parsed.data

  const equipe = await prisma.inscricaoEquipe.create({
    data: {
      nome,
      contato,
      capitao,
      aceiteRegulamento,
      status: 'PENDENTE',
      jogadores: {
        create: jogadores,
      },
    },
    include: { jogadores: true },
  })

  return NextResponse.json(equipe, { status: 201 })
}
