import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import type { Question, CreateQuestionDTO, QuestionFilters } from "@/types"

export async function GET(request: NextRequest): Promise<NextResponse<Question[] | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get("subject") as QuestionFilters["subject"]
    const level = searchParams.get("level") as QuestionFilters["level"]

    const where: any = {}

    if (subject) where.subject = subject
    if (level) where.level = level

    const questions = await prisma.question.findMany({
      where,
      include: {
        options: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ error: "Erro ao buscar questões" }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<Question | { error: string }>> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["ADMIN", "MASTER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body: CreateQuestionDTO = await request.json()
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

    // Criar a questão com suas opções
    const question = await prisma.question.create({
      data: {
        text,
        subject,
        level,
        options: {
          create: options.map((option) => ({
            text: option.text,
            value: option.value,
          })),
        },
      },
      include: {
        options: true,
      },
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error("Error creating question:", error)
    return NextResponse.json({ error: "Erro ao criar questão" }, { status: 500 })
  }
}
