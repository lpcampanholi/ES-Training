import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { GenerateTestDTO } from "@/types/dtos"

export async function POST(request: NextRequest) {
  try {
    const body: GenerateTestDTO = await request.json()
    const { subject, level, leadEmail } = body

    if (!subject || !leadEmail) {
      return NextResponse.json({ error: "Disciplina e ID do usuário são obrigatórios" }, { status: 400 })
    }

    const lead = await prisma.lead.findUnique({
      where: { email: leadEmail },
    })

    if (!lead) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const initialQuestions = await prisma.question.findMany({
      where: { subject, level: level },
      include: { options: true },
      take: 3,
    })

    if (initialQuestions.length < 3) {
      return NextResponse.json({ error: "Não há questões suficientes para iniciar o teste" }, { status: 400 })
    }

    const questionsWithShuffledOptions = initialQuestions.map((question) => ({
      ...question,
      options: [...question.options].sort(() => Math.random() - 0.5),
    }))

    const leadTest = await prisma.leadTest.create({
      data: {
        leadId: lead.id,
        subject,
        level,
      },
    })

    return NextResponse.json({
      testId: leadTest.id,
      questions: questionsWithShuffledOptions,
      currentLevel: level,
    })
  } catch (error) {
    console.error("Error generating test:", error)
    return NextResponse.json({ error: "Erro ao gerar teste" }, { status: 500 })
  }
}
