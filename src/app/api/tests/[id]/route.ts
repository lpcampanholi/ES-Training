import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const test = await prisma.test.findUnique({
      where: { id: params.id },
    })

    if (!test) {
      return NextResponse.json({ error: "Teste não encontrado" }, { status: 404 })
    }

    const questions = await prisma.question.findMany({
      where: { subject: test.subject, level: test.level },
      include: { options: true },
      take: 3,
    })

    if (questions.length < 3) {
      return NextResponse.json({ error: "Não há questões suficientes para iniciar o teste" }, { status: 400 })
    }

    const questionsWithShuffledOptions = questions.map((question) => {
      const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5)
      return {
        ...question,
        options: shuffledOptions,
      }
    })

    return NextResponse.json({
      testId: test.id,
      questions: questionsWithShuffledOptions,
      currentLevel: test.level,
    })
  } catch (error) {
    console.error("Erro ao carregar teste:", error)
    return NextResponse.json({ error: "Erro ao carregar teste" }, { status: 500 })
  }
}
