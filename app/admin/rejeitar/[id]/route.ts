import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  await prisma.inscricaoEquipe.update({
    where: { id },
    data: { status: 'REJEITADA' },
  })

  return NextResponse.redirect(new URL('/admin/dashboard', req.url))
}
