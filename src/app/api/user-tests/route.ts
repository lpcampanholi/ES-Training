import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, testId, answers } = body

    if (!userId || !testId) {
      return NextResponse.json({ error: "Usuário e teste são obrigatórios" }, { status: 400 })
    }

    // Buscar o teste para calcular a pontuação
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    })

    if (!test) {
      return NextResponse.json({ error: "Teste não encontrado" }, { status: 404 })
    }

    // Calcular pontuação
    let correctAnswers = 0
    const totalQuestions = test.questions.length

    // Criar o registro do teste do usuário
    const userTest = await prisma.userTest.create({
      data: {
        userId,
        testId,
        finishedAt: new Date(),
      },
    })

    // Registrar as respostas do usuário
    for (const answer of answers) {
      const question = test.questions.find((q) => q.id === answer.questionId)

      if (question) {
        const correctOption = question.options.find((o) => o.isCorrect)

        if (correctOption && correctOption.id === answer.optionId) {
          correctAnswers++
        }

        await prisma.userAnswer.create({
          data: {
            userTestId: userTest.id,
            questionId: answer.questionId,
            optionId: answer.optionId,
          },
        })
      }
    }

    // Calcular e atualizar a pontuação
    const score = (correctAnswers / totalQuestions) * 10

    await prisma.userTest.update({
      where: { id: userTest.id },
      data: { score },
    })

    return NextResponse.json({
      id: userTest.id,
      score,
    })
  } catch (error) {
    console.error("Error submitting test:", error)
    return NextResponse.json({ error: "Erro ao enviar teste" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || session.user.id

    // Verificar se o usuário é admin ou está buscando seus próprios testes
    if (session.user.role !== "ADMIN" && userId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userTests = await prisma.userTest.findMany({
      where: { userId },
      include: {
        test: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        finishedAt: "desc",
      },
    })

    return NextResponse.json(userTests)
  } catch (error) {
    console.error("Error fetching user tests:", error)
    return NextResponse.json({ error: "Erro ao buscar testes do usuário" }, { status: 500 })
  }
}
