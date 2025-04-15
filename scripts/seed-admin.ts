import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

async function main() {
  const senhaCriptografada = await hash('admin123', 10)

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@liga.com' },
    update: {},
    create: {
      email: 'admin@liga.com',
      senha: senhaCriptografada,
    },
  })

  console.log('✅ Admin criado:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
