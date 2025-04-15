import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const posicoes = ['Goleiro', 'Fixo', 'Ala', 'Pivô']

async function main() {
  for (let i = 1; i <= 8; i++) {
    const equipe = await prisma.equipe.create({
      data: {
        nome: `Equipe ${i}`,
        slug: `equipe-${i}`,
        contato: `equipe${i}@email.com`,
        capitao: `Capitão ${i}`,
        aceiteRegulamento: true,
        jogadores: {
          create: Array.from({ length: 8 }).map((_, j) => ({
            nome: `Jogador ${i}-${j + 1}`,
            numero: j + 1,
            posicao: posicoes[Math.floor(Math.random() * posicoes.length)],
          })),
        },
      },
    })

    console.log(`✅ Equipe ${equipe.nome} criada com 8 jogadores.`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
