import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { GenerateTestDTO, GenerateTestResponse } from "@/types"

export async function POST(request: NextRequest): Promise<NextResponse<GenerateTestResponse | { error: string }>> {
  try {
    const body: GenerateTestDTO = await request.json()
    const { subject, initialLevel = "fundamental", userId } = body

    if (!subject || !userId) {
      return NextResponse.json({ error: "Disciplina e ID do usuário são obrigatórios" }, { status: 400 })
    }

    // Buscar 3 questões aleatórias do nível inicial
    const initialQuestions = await prisma.question.findMany({
      where: {
        subject,
        level: initialLevel,
      },
      include: {
        options: true,
      },
      take: 3,
      orderBy: {
        // Ordenação aleatória
        id: "asc",
      },
    })

    if (initialQuestions.length < 3) {
      return NextResponse.json(
        { error: `Não há questões suficientes do nível ${initialLevel} para a disciplina ${subject}` },
        { status: 400 },
      )
    }

    // Embaralhar as opções de cada questão
    const questionsWithShuffledOptions = initialQuestions.map((question) => {
      const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5)
      return {
        ...question,
        options: shuffledOptions,
      }
    })

    // Criar um novo teste para o usuário
    const userTest = await prisma.userTest.create({
      data: {
        userId,
        subject,
        level: initialLevel,
        questions: JSON.stringify(questionsWithShuffledOptions.map((q) => q.id)),
        answers: JSON.stringify({}),
      },
    })

    return NextResponse.json({
      testId: userTest.id,
      questions: questionsWithShuffledOptions,
      currentLevel: initialLevel,
    })
  } catch (error) {
    console.error("Error generating test:", error)
    return NextResponse.json({ error: "Erro ao gerar teste" }, { status: 500 })
  }
}
