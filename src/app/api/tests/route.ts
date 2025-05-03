import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get("subjectId")
    const level = searchParams.get("level")

    const where: any = {}

    if (subjectId) {
      where.subjectId = subjectId
    }

    if (level) {
      where.level = level
    }

    const tests = await prisma.test.findMany({
      where,
      include: {
        subject: true,
        questions: {
          select: {
            id: true,
            order: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    })

    return NextResponse.json(tests)
  } catch (error) {
    console.error("Error fetching tests:", error)
    return NextResponse.json({ error: "Erro ao buscar testes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, level, description, timeLimit, subjectId } = body

    if (!title || !slug || !level || !subjectId) {
      return NextResponse.json({ error: "Título, slug, nível e disciplina são obrigatórios" }, { status: 400 })
    }

    const test = await prisma.test.create({
      data: {
        title,
        slug,
        level,
        description,
        timeLimit: timeLimit || 1200,
        subjectId,
      },
    })

    return NextResponse.json(test)
  } catch (error) {
    console.error("Error creating test:", error)
    return NextResponse.json({ error: "Erro ao criar teste" }, { status: 500 })
  }
}
