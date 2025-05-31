import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getNextLevel } from "@/utils"
import type { Level } from "@prisma/client"
import { SubmitAnswersDTO } from "@/types/dtos"

const AVERAGE = 8.0

function canReachAverage(currentSum: number, currentCount: number, remainingQuestions: number): boolean {
  const maxPossibleTotal = currentSum + (remainingQuestions * 10)
  const maxPossibleAverage = maxPossibleTotal / (currentCount + remainingQuestions)
  return maxPossibleAverage >= AVERAGE
}

function getRecommendedLevel(average: number, currentLevel: Level): Level {
  return average >= AVERAGE ? getNextLevel(currentLevel) : currentLevel
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitAnswersDTO = await request.json()
    const { testId, answers, isComplete = false } = body

    if (!testId || !answers || typeof answers !== 'object') {
      return NextResponse.json({ error: "ID do teste e respostas são obrigatórios" }, { status: 400 })
    }

    const test = await prisma.test.findUnique({
      where: { id: testId },
    })

    if (!test) {
      return NextResponse.json({ error: "Teste não encontrado" }, { status: 404 })
    }

    // Salvar as novas respostas no banco (UserAnswer)
    const answerEntries = Object.entries(answers) // [ [questionId, optionId], ... ]

    const userAnswersData = answerEntries.map(([questionId, optionId]) => ({
      testId,
      questionId,
      optionId,
    }))

    await prisma.answer.createMany({ data: userAnswersData })

    // Buscar todas as respostas do usuário nesse teste
    const allAnswers = await prisma.answer.findMany({
      where: { testId: testId },
      include: {
        question: true,
        option: true,
      },
    })

    const currentLevelAnswers = allAnswers.filter(
      (a) => a.question.level === test.level
    )

    const answeredCount = currentLevelAnswers.length
    const totalScore = currentLevelAnswers.reduce((sum, a) => sum + (a.option?.value || 0), 0)
    const currentAverage = answeredCount > 0 ? totalScore / answeredCount : 0

    // Finalizar teste se for forçado
    if (isComplete || answeredCount >= 5) {
      const recommendedLevel = getRecommendedLevel(currentAverage, test.level)

      await prisma.test.update({
        where: { id: testId },
        data: {
          score: currentAverage,
          finishedAt: new Date(),
        },
      })

      return NextResponse.json({
        testId,
        isComplete: true,
        score: currentAverage,
        recommendedLevel,
        currentLevel: test.level,
        passedLevel: currentAverage >= AVERAGE,
      })
    }

    // Lógica de avanço de nível após 3 ou 4 respostas
    if (answeredCount === 3 || answeredCount === 4) {
      if (currentAverage >= AVERAGE) {
        const nextLevel = getNextLevel(test.level)

        if (nextLevel === test.level) {
          // Já está no nível máximo
          await prisma.test.update({
            where: { id: testId },
            data: {
              score: currentAverage,
              finishedAt: new Date(),
            },
          })

          return NextResponse.json({
            testId,
            isComplete: true,
            score: currentAverage,
            recommendedLevel: nextLevel,
            currentLevel: test.level,
            passedLevel: true,
            message: "Parabéns! Você atingiu o nível máximo.",
          })
        }

        // Buscar 3 novas questões do próximo nível
        const newQuestions = await prisma.question.findMany({
          where: {
            subject: test.subject,
            level: nextLevel,
            id: {
              notIn: allAnswers.map((a) => a.questionId),
            },
          },
          include: { options: true },
          take: 3,
        })

        if (newQuestions.length < 3) {
          // Finaliza porque não tem questões suficientes no próximo nível
          await prisma.test.update({
            where: { id: testId },
            data: {
              score: currentAverage,
              finishedAt: new Date(),
            },
          })

          return NextResponse.json({
            testId,
            isComplete: true,
            score: currentAverage,
            recommendedLevel: nextLevel,
            currentLevel: test.level,
            passedLevel: true,
            message: "Você avançaria de nível, mas não há questões suficientes disponíveis.",
          })
        }

        // Avançar de nível
        await prisma.test.update({
          where: { id: testId },
          data: { level: nextLevel },
        })

        return NextResponse.json({
          testId,
          questions: newQuestions.map((q) => ({
            ...q,
            options: [...q.options].sort(() => Math.random() - 0.5),
          })),
          currentLevel: nextLevel,
          previousLevel: test.level,
          isComplete: false,
          passedLevel: true,
          message: `Você superou o nível ${test.level} e agora está no nível ${nextLevel}.`,
        })
      } else {
        const remaining = 5 - answeredCount
        if (!canReachAverage(totalScore, answeredCount, remaining)) {
          // Finalizar o teste — não é possível atingir média 8.0
          await prisma.test.update({
            where: { id: testId },
            data: {
              score: currentAverage,
              finishedAt: new Date(),
            },
          })

          return NextResponse.json({
            testId,
            isComplete: true,
            score: currentAverage,
            recommendedLevel: test.level,
            currentLevel: test.level,
            passedLevel: false,
            message: "Não é possível atingir a média 8.0 com as próximas questões. Teste finalizado.",
          })
        }
      }
    }

    // Buscar nova questão do nível atual (caso ainda não completou 5)
    const additionalQuestions = await prisma.question.findMany({
      where: {
        subject: test.subject,
        level: test.level,
        id: {
          notIn: allAnswers.map((a) => a.questionId),
        },
      },
      include: { options: true },
      take: 1,
    })

    if (additionalQuestions.length === 0) {
      await prisma.test.update({
        where: { id: testId },
        data: {
          score: currentAverage,
          finishedAt: new Date(),
        },
      })

      return NextResponse.json({
        testId,
        isComplete: true,
        score: currentAverage,
        recommendedLevel: getRecommendedLevel(currentAverage, test.level),
        currentLevel: test.level,
        passedLevel: currentAverage >= AVERAGE,
        message: "Não há mais questões disponíveis para continuar.",
      })
    }

    // Retornar próxima questão
    return NextResponse.json({
      testId,
      questions: additionalQuestions.map((q) => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5),
      })),
      currentLevel: test.level,
      isComplete: false,
      currentAverage,
      passedLevel: false
    })
  } catch (error) {
    console.error("Erro ao processar respostas:", error)
    return NextResponse.json({ error: "Erro ao enviar respostas" }, { status: 500 })
  }
}
