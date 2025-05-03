import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { text, imageUrl, testId, options } = body

    if (!text || !testId || !options || options.length === 0) {
      return NextResponse.json({ error: "Texto, teste e opções são obrigatórios" }, { status: 400 })
    }

    // Encontrar a ordem mais alta atual
    const highestOrder = await prisma.question.findFirst({
      where: { testId },
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const newOrder = highestOrder ? highestOrder.order + 1 : 1

    // Criar a questão com suas opções
    const question = await prisma.question.create({
      data: {
        text,
        imageUrl,
        testId,
        order: newOrder,
        options: {
          create: options.map((option: any, index: number) => ({
            text: option.text,
            isCorrect: option.isCorrect,
            order: ["a", "b", "c", "d", "e"][index],
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
