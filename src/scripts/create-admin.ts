import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  const password = await hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@example.com",
      password,
      role: "ADMIN",
    },
  })

  console.log({ admin })

  // Criar disciplinas iniciais
  const subjects = [
    { name: "Excel", slug: "excel", color: "bg-emerald-50 text-emerald-600" },
    { name: "PowerBI", slug: "powerbi", color: "bg-amber-50 text-amber-600" },
    { name: "SQL", slug: "sql", color: "bg-blue-50 text-blue-600" },
    { name: "Python", slug: "python", color: "bg-purple-50 text-purple-600" },
  ]

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { slug: subject.slug },
      update: {},
      create: subject,
    })
  }

  console.log("Disciplinas iniciais criadas!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
