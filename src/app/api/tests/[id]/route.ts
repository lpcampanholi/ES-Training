import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { TestResultResponse } from "@/types"

interface RouteParams {
  params: { id: string }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<TestResultResponse | { error: string }>> {
  try {
    const userTest = await prisma.userTest.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!userTest) {
      return NextResponse.json({ error: "Teste não encontrado" }, { status: 404 })
    }

    // Buscar as questões do teste
    const questionIds = JSON.parse(userTest.questions as string)
    const questions = await prisma.question.findMany({
      where: {
        id: {
          in: questionIds.slice(0, 3), // Pegar apenas as 3 primeiras questões
        },
      },
      include: {
        options: true,
      },
    })

    // Embaralhar as opções de cada questão
    const questionsWithShuffledOptions = questions.map((question) => {
      const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5)
      return {
        ...question,
        options: shuffledOptions,
      }
    })

    return NextResponse.json({
      testId: userTest.id,
      questions: questionsWithShuffledOptions,
      currentLevel: userTest.level,
    })
  } catch (error) {
    console.error("Error fetching test:", error)
    return NextResponse.json({ error: "Erro ao buscar teste" }, { status: 500 })
  }
}
