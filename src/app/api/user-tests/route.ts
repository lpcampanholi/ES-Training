import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, testId, answers, score } = body

    if (!userId || !testId) {
      return NextResponse.json({ error: "Usuário e teste são obrigatórios" }, { status: 400 })
    }

    // Buscar o teste para verificar se existe
    const test = await prisma.test.findUnique({
      where: { id: testId },
    })

    if (!test) {
      return NextResponse.json({ error: "Teste não encontrado" }, { status: 404 })
    }

    // Criar o registro do teste do usuário com a pontuação fornecida pelo cliente
    const userTest = await prisma.userTest.create({
      data: {
        userId,
        testId,
        score: score || 0,
        finishedAt: new Date(),
      },
    })

    // Registrar as respostas do usuário
    for (const answer of answers) {
      await prisma.userAnswer.create({
        data: {
          userTestId: userTest.id,
          questionId: answer.questionId,
          optionId: answer.optionId,
        },
      })
    }

    return NextResponse.json({
      id: userTest.id,
      score: score || 0,
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
        test: true,
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
