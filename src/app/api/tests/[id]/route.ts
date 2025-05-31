import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leadTest = await prisma.leadTest.findUnique({
      where: { id: params.id },
    })

    if (!leadTest) {
      return NextResponse.json({ error: "Teste não encontrado" }, { status: 404 })
    }

    const questions = await prisma.question.findMany({
      where: { subject: leadTest.subject, level: leadTest.level },
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
      testId: leadTest.id,
      questions: questionsWithShuffledOptions,
      currentLevel: leadTest.level,
    })
  } catch (error) {
    console.error("Erro ao carregar teste:", error)
    return NextResponse.json({ error: "Erro ao carregar teste" }, { status: 500 })
  }
}
