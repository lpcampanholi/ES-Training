import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const test = await prisma.test.findUnique({
      where: {
        id: params.id,
      },
      include: {
        subject: true,
        questions: {
          orderBy: {
            order: "asc",
          },
          include: {
            options: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    })

    if (!test) {
      return NextResponse.json({ error: "Teste não encontrado" }, { status: 404 })
    }

    return NextResponse.json(test)
  } catch (error) {
    console.error("Error fetching test:", error)
    return NextResponse.json({ error: "Erro ao buscar teste" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, level, description, timeLimit, isActive } = body

    if (!title || !slug || !level) {
      return NextResponse.json({ error: "Título, slug e nível são obrigatórios" }, { status: 400 })
    }

    const test = await prisma.test.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        slug,
        level,
        description,
        timeLimit,
        isActive,
      },
    })

    return NextResponse.json(test)
  } catch (error) {
    console.error("Error updating test:", error)
    return NextResponse.json({ error: "Erro ao atualizar teste" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    await prisma.test.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting test:", error)
    return NextResponse.json({ error: "Erro ao excluir teste" }, { status: 500 })
  }
}
