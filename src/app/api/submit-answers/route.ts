import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { SubmitAnswersDTO, SubmitAnswersResponse, Level } from "@/types"
import { getNextLevel } from "@/utils"

// Função para verificar se o usuário pode atingir a média 8.0
function canReachAverage(currentSum: number, currentCount: number, remainingQuestions: number): boolean {
  // Pontuação máxima possível nas questões restantes (10.0 por questão)
  const maxPossibleAdditionalScore = remainingQuestions * 10.0

  // Pontuação total possível
  const maxPossibleTotalScore = currentSum + maxPossibleAdditionalScore

  // Média máxima possível
  const maxPossibleAverage = maxPossibleTotalScore / (currentCount + remainingQuestions)

  // Verificar se a média máxima possível é >= 8.0
  return maxPossibleAverage >= 8.0
}

// Função para obter o nível recomendado com base na média
function getRecommendedLevel(average: number, currentLevel: Level): Level {
  // Se a média for >= 8.0, o usuário passa para o próximo nível
  if (average >= 8.0) {
    return getNextLevel(currentLevel)
  }

  // Caso contrário, permanece no nível atual
  return currentLevel
}

export async function POST(request: NextRequest): Promise<NextResponse<SubmitAnswersResponse | { error: string }>> {
  try {
    const body: SubmitAnswersDTO = await request.json()
    const { testId, answers, isComplete = false } = body

    if (!testId || !answers) {
      return NextResponse.json({ error: "ID do teste e respostas são obrigatórios" }, { status: 400 })
    }

    // Buscar o teste atual
    const userTest = await prisma.userTest.findUnique({
      where: {
        id: testId,
      },
    })

    if (!userTest) {
      return NextResponse.json({ error: "Teste não encontrado" }, { status: 404 })
    }

    // Atualizar as respostas do teste
    const updatedUserTest = await prisma.userTest.update({
      where: {
        id: testId,
      },
      data: {
        answers: JSON.stringify(answers),
        finishedAt: isComplete ? new Date() : undefined,
      },
    })

    // Buscar as questões do teste
    const questionIds = JSON.parse(userTest.questions as string)
    const questions = await prisma.question.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
      include: {
        options: true,
      },
    })

    // Calcular a pontuação atual
    let totalScore = 0
    const answersObj = JSON.parse(answers)
    const answeredQuestions = []

    for (const question of questions) {
      if (answersObj[question.id]) {
        // Encontrar a opção selecionada
        const selectedOption = question.options.find((opt) => opt.id === answersObj[question.id])
        if (selectedOption) {
          totalScore += selectedOption.value
          answeredQuestions.push(question)
        }
      }
    }

    // Calcular a média atual
    const currentAverage = answeredQuestions.length > 0 ? totalScore / answeredQuestions.length : 0

    // Se o teste estiver completo ou se já respondeu 5 questões, finalizar o teste
    if (isComplete || answeredQuestions.length >= 5) {
      // Determinar o nível recomendado
      const recommendedLevel = getRecommendedLevel(currentAverage, userTest.level)

      // Atualizar a pontuação e finalizar o teste
      await prisma.userTest.update({
        where: {
          id: testId,
        },
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
        currentLevel: userTest.level,
        passedLevel: currentAverage >= 8.0,
      })
    }

    // Verificar se já respondeu as 3 questões obrigatórias
    if (answeredQuestions.length >= 3) {
      // Verificar se pode atingir a média 8.0 com as questões restantes
      const canReach = canReachAverage(totalScore, answeredQuestions.length, 5 - answeredQuestions.length)

      if (!canReach) {
        // Não pode atingir a média, finalizar o teste
        await prisma.userTest.update({
          where: {
            id: testId,
          },
          data: {
            score: currentAverage,
            finishedAt: new Date(),
          },
        })

        return NextResponse.json({
          testId,
          isComplete: true,
          score: currentAverage,
          recommendedLevel: userTest.level,
          currentLevel: userTest.level,
          passedLevel: false,
          message: "Não é possível atingir a média necessária para avançar de nível.",
        })
      }
    }

    // Se a média atual for >= 8.0 e já respondeu 3 questões, avançar para o próximo nível
    if (currentAverage >= 8.0 && answeredQuestions.length >= 3) {
      const nextLevel = getNextLevel(userTest.level)

      // Se já está no nível máximo, finalizar o teste
      if (nextLevel === userTest.level) {
        await prisma.userTest.update({
          where: {
            id: testId,
          },
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
          currentLevel: userTest.level,
          passedLevel: true,
          message: "Parabéns! Você atingiu o nível máximo.",
        })
      }

      // Buscar 3 novas questões do próximo nível
      const newQuestions = await prisma.question.findMany({
        where: {
          subject: userTest.subject,
          level: nextLevel,
          id: {
            notIn: questionIds, // Excluir questões já respondidas
          },
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

      if (newQuestions.length < 3) {
        // Se não houver questões suficientes no próximo nível, finalizar o teste
        await prisma.userTest.update({
          where: {
            id: testId,
          },
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
          currentLevel: userTest.level,
          passedLevel: true,
          message: "Parabéns! Você passou para o próximo nível, mas não há questões suficientes disponíveis.",
        })
      }

      // Embaralhar as opções de cada questão
      const questionsWithShuffledOptions = newQuestions.map((question) => {
        const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5)
        return {
          ...question,
          options: shuffledOptions,
        }
      })

      // Atualizar o teste com as novas questões e o novo nível
      const updatedQuestionIds = [...questionIds, ...newQuestions.map((q) => q.id)]
      await prisma.userTest.update({
        where: {
          id: testId,
        },
        data: {
          questions: JSON.stringify(updatedQuestionIds),
          level: nextLevel,
        },
      })

      return NextResponse.json({
        testId,
        questions: questionsWithShuffledOptions,
        currentLevel: nextLevel,
        previousLevel: userTest.level,
        isComplete: false,
        passedLevel: true,
        message: `Parabéns! Você superou o nível ${userTest.level} e agora está no nível ${nextLevel}.`,
      })
    }

    // Se ainda não respondeu 5 questões e não passou para o próximo nível, buscar mais questões do nível atual
    if (answeredQuestions.length < 5) {
      // Buscar mais questões do nível atual
      const additionalQuestions = await prisma.question.findMany({
        where: {
          subject: userTest.subject,
          level: userTest.level,
          id: {
            notIn: questionIds, // Excluir questões já respondidas
          },
        },
        include: {
          options: true,
        },
        take: 5 - answeredQuestions.length, // Buscar apenas as questões necessárias para completar 5
        orderBy: {
          // Ordenação aleatória
          id: "asc",
        },
      })

      if (additionalQuestions.length === 0) {
        // Se não houver mais questões disponíveis, finalizar o teste
        await prisma.userTest.update({
          where: {
            id: testId,
          },
          data: {
            score: currentAverage,
            finishedAt: new Date(),
          },
        })

        return NextResponse.json({
          testId,
          isComplete: true,
          score: currentAverage,
          recommendedLevel: getRecommendedLevel(currentAverage, userTest.level),
          currentLevel: userTest.level,
          passedLevel: currentAverage >= 8.0,
          message: "Não há mais questões disponíveis para continuar o teste.",
        })
      }

      // Embaralhar as opções de cada questão
      const questionsWithShuffledOptions = additionalQuestions.map((question) => {
        const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5)
        return {
          ...question,
          options: shuffledOptions,
        }
      })

      // Atualizar o teste com as novas questões
      const updatedQuestionIds = [...questionIds, ...additionalQuestions.map((q) => q.id)]
      await prisma.userTest.update({
        where: {
          id: testId,
        },
        data: {
          questions: JSON.stringify(updatedQuestionIds),
        },
      })

      return NextResponse.json({
        testId,
        questions: questionsWithShuffledOptions,
        currentLevel: userTest.level,
        isComplete: false,
        currentAverage,
      })
    }

    // Se chegou aqui, finalizar o teste
    await prisma.userTest.update({
      where: {
        id: testId,
      },
      data: {
        score: currentAverage,
        finishedAt: new Date(),
      },
    })

    return NextResponse.json({
      testId,
      isComplete: true,
      score: currentAverage,
      recommendedLevel: getRecommendedLevel(currentAverage, userTest.level),
      currentLevel: userTest.level,
      passedLevel: currentAverage >= 8.0,
    })
  } catch (error) {
    console.error("Error submitting answers:", error)
    return NextResponse.json({ error: "Erro ao enviar respostas" }, { status: 500 })
  }
}
