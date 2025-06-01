import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Level } from "@prisma/client";
import { SubmitAnswersDTO } from "@/types/dtos";
import { getNextLevel } from "@/utils";

const AVERAGE = 8.0;

function canReachAverage(currentSum: number, currentCount: number): boolean {
  return (currentSum + 10) / (currentCount + 1) >= AVERAGE;
}

function getRecommendedLevel(average: number, currentLevel: Level): Level {
  return average >= AVERAGE ? getNextLevel(currentLevel) : currentLevel;
}

async function updateLeadAfterTest(testId: string, level: Level, subject: string, score: number) {
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: { lead: true },
  });

  if (test?.leadId) {
    await prisma.lead.update({
      where: { id: test.leadId },
      data: {
        testLevel: level,
        testSubject: subject as any,
        fromTest: true,
        stage: "PENDENTE",
        observations: `Teste finalizado com nota ${score.toFixed(1).replace(".", ",")}`,
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitAnswersDTO = await request.json();
    const { testId, answers, isComplete = false } = body;

    if (!testId || !answers || typeof answers !== "object") {
      return NextResponse.json({ error: "ID do teste e respostas são obrigatórios" }, { status: 400 });
    }

    const test = await prisma.test.findUnique({ where: { id: testId } });
    if (!test) {
      return NextResponse.json({ error: "Teste não encontrado" }, { status: 404 });
    }

    const existingAnswers = await prisma.answer.findMany({
      where: {
        testId,
        questionId: { in: Object.keys(answers) },
      },
    })

    const existingQuestionIds = new Set(existingAnswers.map(a => a.questionId))

    const newAnswers = Object.entries(answers)
      .filter(([questionId]) => !existingQuestionIds.has(questionId))
      .map(([questionId, optionId]) => ({
        testId,
        questionId,
        optionId,
      }))

    if (newAnswers.length > 0) {
      await prisma.answer.createMany({ data: newAnswers })
    }

    const allAnswers = await prisma.answer.findMany({
      where: { testId },
      include: { question: true, option: true },
    });

    const currentLevelAnswers = allAnswers.filter(a => a.question.level === test.level);
    const answeredCount = currentLevelAnswers.length;
    const totalScore = currentLevelAnswers.reduce((sum, a) => sum + (a.option?.value || 0), 0);
    const currentAverage = answeredCount > 0 ? totalScore / answeredCount : 0;

    if (isComplete || answeredCount >= 5) {
      console.log("entrou aqui------------------------------------------------------------------------------------------------");
      console.log("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111");
      console.log("answeredCount", answeredCount);
      const recommendedLevel = getRecommendedLevel(currentAverage, test.level);

      await prisma.test.update({
        where: { id: testId },
        data: { score: currentAverage, finishedAt: new Date() },
      });

      await updateLeadAfterTest(testId, recommendedLevel, test.subject, currentAverage);

      return NextResponse.json({
        testId,
        isComplete: true,
        score: currentAverage,
        recommendedLevel,
        currentLevel: test.level,
        passedLevel: currentAverage >= AVERAGE,
      });
    }

    if (answeredCount === 3 || answeredCount === 4) {
      console.log("entrou aqui------------------------------------------------------------------------------------------------")
      console.log("22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222");
      console.log("answeredCount", answeredCount);
      if (currentAverage >= AVERAGE) {
        const nextLevel = getNextLevel(test.level);

        if (nextLevel === test.level) {
          await prisma.test.update({
            where: { id: testId },
            data: { score: currentAverage, finishedAt: new Date() },
          });

          await updateLeadAfterTest(testId, nextLevel, test.subject, currentAverage);

          return NextResponse.json({
            testId,
            isComplete: true,
            score: currentAverage,
            recommendedLevel: nextLevel,
            currentLevel: test.level,
            passedLevel: true,
            message: "Parabéns! Você atingiu o nível máximo.",
          });
        }

        const newQuestions = await prisma.question.findMany({
          where: {
            subject: test.subject,
            level: nextLevel,
            id: { notIn: allAnswers.map((a) => a.questionId) },
          },
          include: { options: true },
          take: 3,
        });

        if (newQuestions.length < 3) {
          await prisma.test.update({
            where: { id: testId },
            data: { score: currentAverage, finishedAt: new Date() },
          });

          await updateLeadAfterTest(testId, nextLevel, test.subject, currentAverage);

          return NextResponse.json({
            testId,
            isComplete: true,
            score: currentAverage,
            recommendedLevel: nextLevel,
            currentLevel: test.level,
            passedLevel: true,
            message: "Você avançaria de nível, mas não há questões suficientes disponíveis.",
          });
        }

        await prisma.test.update({
          where: { id: testId },
          data: { level: nextLevel },
        });

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
        });
      } else {
        if (!canReachAverage(totalScore)) {
          await prisma.test.update({
            where: { id: testId },
            data: { score: currentAverage, finishedAt: new Date() },
          });

          await updateLeadAfterTest(testId, test.level, test.subject, currentAverage);

          return NextResponse.json({
            testId,
            isComplete: true,
            score: currentAverage,
            recommendedLevel: test.level,
            currentLevel: test.level,
            passedLevel: false,
            message: `Não é possível atingir a média ${AVERAGE} com a próxima questão. Teste finalizado.`,
          });
        }
      }
    }

    const additionalQuestions = await prisma.question.findMany({
      where: {
        subject: test.subject,
        level: test.level,
        id: { notIn: allAnswers.map((a) => a.questionId) },
      },
      include: { options: true },
      take: 1,
    });

    if (additionalQuestions.length === 0) {
      await prisma.test.update({
        where: { id: testId },
        data: { score: currentAverage, finishedAt: new Date() },
      });

      await updateLeadAfterTest(
        testId,
        getRecommendedLevel(currentAverage, test.level),
        test.subject,
        currentAverage
      );

      return NextResponse.json({
        testId,
        isComplete: true,
        score: currentAverage,
        recommendedLevel: getRecommendedLevel(currentAverage, test.level),
        currentLevel: test.level,
        passedLevel: currentAverage >= AVERAGE,
        message: "Não há mais questões disponíveis para continuar.",
      });
    }

    return NextResponse.json({
      testId,
      questions: additionalQuestions.map((q) => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5),
      })),
      currentLevel: test.level,
      isComplete: false,
      currentAverage,
      passedLevel: false,
    });
  } catch (error) {
    console.error("Erro ao processar respostas:", error);
    return NextResponse.json({ error: "Erro ao enviar respostas" }, { status: 500 });
  }
}
