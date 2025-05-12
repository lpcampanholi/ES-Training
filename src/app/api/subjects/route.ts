import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        tests: {
          select: {
            id: true,
            title: true,
            level: true,
            isActive: true,
          },
        },
      },
    })
    console.log("Fetched subjects:", subjects)
    return NextResponse.json(subjects)
  } catch (error) {
    console.error("Error fetching subjects:", error)
    return NextResponse.json({ error: "Erro ao buscar disciplinas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, icon, color } = body

    if (!name || !slug) {
      return NextResponse.json({ error: "Nome e slug são obrigatórios" }, { status: 400 })
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        slug,
        icon,
        color,
      },
    })

    return NextResponse.json(subject)
  } catch (error) {
    console.error("Error creating subject:", error)
    return NextResponse.json({ error: "Erro ao criar disciplina" }, { status: 500 })
  }
}
