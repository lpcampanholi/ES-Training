import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const question = await prisma.question.findUnique({
      where: {
        id: params.id,
      },
      include: {
        options: {
          orderBy: {
            order: "asc",
          },
        },
      },
    })

    if (!question) {
      return NextResponse.json({ error: "Questão não encontrada" }, { status: 404 })
    }

    return NextResponse.json(question)
  } catch (error) {
    console.error("Error fetching question:", error)
    return NextResponse.json({ error: "Erro ao buscar questão" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { text, imageUrl, options } = body

    if (!text || !options || options.length === 0) {
      return NextResponse.json({ error: "Texto e opções são obrigatórios" }, { status: 400 })
    }

    // Atualizar a questão
    const question = await prisma.question.update({
      where: {
        id: params.id,
      },
      data: {
        text,
        imageUrl,
      },
    })

    // Atualizar ou criar opções
    for (const option of options) {
      if (option.id) {
        await prisma.option.update({
          where: { id: option.id },
          data: {
            text: option.text,
            isCorrect: option.isCorrect,
          },
        })
      } else {
        await prisma.option.create({
          data: {
            text: option.text,
            isCorrect: option.isCorrect,
            order: option.order,
            questionId: params.id,
          },
        })
      }
    }

    // Buscar a questão atualizada com suas opções
    const updatedQuestion = await prisma.question.findUnique({
      where: {
        id: params.id,
      },
      include: {
        options: {
          orderBy: {
            order: "asc",
          },
        },
      },
    })

    return NextResponse.json(updatedQuestion)
  } catch (error) {
    console.error("Error updating question:", error)
    return NextResponse.json({ error: "Erro ao atualizar questão" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Excluir a questão (as opções serão excluídas em cascata)
    await prisma.question.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json({ error: "Erro ao excluir questão" }, { status: 500 })
  }
}
