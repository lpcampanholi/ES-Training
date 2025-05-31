import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import type { UpdateQuestionDTO } from "@/types/dtos"
import { Question } from "@prisma/client"

interface RouteParams {
  params: { id: string }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<Question | { error: string }>> {
  try {
    const question = await prisma.question.findUnique({
      where: {
        id: params.id,
      },
      include: {
        options: true,
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

export async function PUT(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<Question | { error: string }>> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["ADMIN", "MASTER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body: UpdateQuestionDTO = await request.json()
    const { text, subject, level, options } = body

    if (!text || !subject || !level || !options || options.length !== 4) {
      return NextResponse.json({ error: "Texto, disciplina, nível e 4 opções são obrigatórios" }, { status: 400 })
    }

    // Validar se pelo menos uma opção tem valor 10.0 (totalmente correta)
    const hasCorrectOption = options.some((option) => option.value === 10.0)
    if (!hasCorrectOption) {
      return NextResponse.json(
        { error: "Pelo menos uma opção deve ser totalmente correta (valor 10.0)" },
        { status: 400 },
      )
    }

    // Validar se todas as opções têm valores válidos
    const validValues = [0.0, 4.0, 7.0, 10.0]
    const allOptionsHaveValidValues = options.every((option) => validValues.includes(option.value))
    if (!allOptionsHaveValidValues) {
      return NextResponse.json(
        { error: "Todas as opções devem ter valores válidos (0.0, 4.0, 7.0 ou 10.0)" },
        { status: 400 },
      )
    }

    // Atualizar a questão
    const question = await prisma.question.update({
      where: {
        id: params.id,
      },
      data: {
        text,
        subject,
        level,
      },
    })

    // Excluir todas as opções existentes
    await prisma.option.deleteMany({
      where: {
        questionId: params.id,
      },
    })

    // Criar novas opções
    for (const option of options) {
      await prisma.option.create({
        data: {
          text: option.text,
          value: option.value,
          questionId: params.id,
        },
      })
    }

    // Buscar a questão atualizada com suas opções
    const updatedQuestion = await prisma.question.findUnique({
      where: {
        id: params.id,
      },
      include: {
        options: true,
      },
    })

    return NextResponse.json(updatedQuestion!)
  } catch (error) {
    console.error("Error updating question:", error)
    return NextResponse.json({ error: "Erro ao atualizar questão" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["ADMIN", "MASTER"].includes(session.user.role)) {
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
