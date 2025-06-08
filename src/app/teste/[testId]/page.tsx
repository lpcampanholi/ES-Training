"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, AlertCircle, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { formatTime } from "@/lib/utils"
import parse from "html-react-parser"
import { Badge } from "@/components/ui/badge"
import { CelebrationModal } from "@/components/celebration-modal"
import { TestService } from "@/services/test-service"
import { getLevelColor, getLevelName, getSubjectColor } from "@/utils"
import { Level } from "@prisma/client"
import { useModalConfirm } from "@/contexts/modal-confirm-context"
import { FrontendQuestion } from "@/types"

export interface TestData {
  testId: string
  questions: FrontendQuestion[]
  currentLevel: Level
}

export default function TestePage({
  params,
}: {
  params: Promise<{ testId: string }>
}) {
  const router = useRouter()
  const { testId } = use(params)
  const modalConfirm = useModalConfirm()

  const [testData, setTestData] = useState<TestData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(1200)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentBatch, setCurrentBatch] = useState<FrontendQuestion[]>([])
  const [currentLevel, setCurrentLevel] = useState<Level>("fundamental")
  const [previousLevel, setPreviousLevel] = useState<Level>(currentLevel)
  const [answeredCount, setAnsweredCount] = useState(0)

  const [celebrationModal, setCelebrationModal] = useState<{
    isOpen: boolean
    previousLevel: Level
    nextLevel: Level
    message: string
  }>({
    isOpen: false,
    previousLevel: "fundamental",
    nextLevel: "essencial",
    message: "",
  })

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const data = await TestService.getTestById(testId)
        setTestData(data)
        setCurrentBatch(data.questions)
        setCurrentLevel(data.currentLevel)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || "Erro ao carregar teste")
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchTestData()
  }, [testId])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleShowConfirmFinish("Tempo esgotado", "Seu tempo acabou. Deseja finalizar o teste?")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  const handleNextQuestion = () => {
    const currentQuestion = currentBatch[currentQuestionIndex]
    if (!selectedAnswers[currentQuestion.id]) {
      toast("Selecione uma resposta", {
        description: "Por favor, selecione uma resposta antes de continuar",
      })
      return
    }

    if (currentQuestionIndex < currentBatch.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      window.scrollTo(0, 0)
    } else {
      handleSubmitAnswers()
    }
  }

  const handleSubmitAnswers = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const batchSize = currentBatch.length
      const response = await TestService.submitAnswers({
        testId,
        answers: selectedAnswers,
      })

      if (response.isComplete) {
        router.push(
          `/resultado?score=${response.score?.toFixed(1).replace(".", ",")|| "0,0"}&level=${response.recommendedLevel || currentLevel}`,
        )
      } else {
        // Se o nível atual mudou, resetamos o batch
        if (response.currentLevel !== previousLevel) {
          setCurrentBatch(response.questions || [])
          setPreviousLevel(response.currentLevel || currentLevel)
          setCurrentLevel(response.currentLevel || currentLevel)
          setCurrentQuestionIndex(0)
          setAnsweredCount((prev) => prev + batchSize)
        } else {
          setCurrentBatch((prevBatch) => [...prevBatch, ...(response.questions || [])])
          setCurrentQuestionIndex(3)
          window.scrollTo(0, 0)
        }
        
        if (response.currentLevel !== currentLevel && response.previousLevel) {
          setCelebrationModal({
            isOpen: true,
            previousLevel: response.previousLevel,
            nextLevel: response.currentLevel || "essencial",
            message: response.message || "",
          })
        }

        if (response.message && !response.message.startsWith("Você superou")) {
          toast(response.message)
        }
      }
    } catch (error) {
      toast("Erro", {
        description: error instanceof Error ? error.message : "Ocorreu um erro ao enviar suas respostas",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinishTest = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await TestService.submitAnswers({
        testId,
        answers: selectedAnswers,
        isComplete: true,
      })

      router.push(
        `/resultado?score=${response.score?.toFixed(1).replace(".", ",") || "0,0"}&testId=${testId}&level=${response.recommendedLevel || currentLevel}`,
      )
    } catch (error) {
      toast("Erro ao finalizar teste", {
        description: error instanceof Error ? error.message : "Ocorreu um erro ao finalizar o teste",
      })
      setIsSubmitting(false)
    }
  }

  const handleShowConfirmFinish = (title: string, message: string) => {
    modalConfirm.open({
      title,
      message,
      onConfirm: handleFinishTest,
    })
  }

  if (isLoading) {
    return (
    <div className="text-center p-4 min-h-screen bg-[#005345]">
      <div className="flex justify-center py-10">
        <Loader2 className="w-7 h-7 animate-spin text-white" />
      </div>
    </div>
    )
  }

  if (error || !testData || currentBatch.length === 0) {
    return <div className="text-center py-10 text-red-500">{error || "Teste não encontrado"}</div>
  }

  const currentQuestion = currentBatch[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / currentBatch.length) * 100
  const totalAnswered = answeredCount + currentQuestionIndex + 1

  return (
    <main className="flex flex-col items-center justify-center p-4 min-h-screen bg-[#005345]">
      <div className="w-full max-w-4xl p-6 sm:p-8 bg-white rounded-2xl shadow-sm">

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className={`${getSubjectColor(currentQuestion.subject)} text-sm font-medium px-3 rounded-full border-1 border-neutral-200`}>
              {currentQuestion.subject === "powerbi" ? "Power BI" : currentQuestion.subject.toUpperCase()}
            </div>
            <Badge className={getLevelColor(currentLevel)}>{getLevelName(currentLevel)}</Badge>
          </div>
          <div className="flex items-center text-sm text-neutral-700 bg-neutral-100 border-1 px-3 w-22 rounded-full">
            <Clock className="w-4 h-4 mr-2 text-[#ff7100]" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-neutral-600">
              Progresso - {currentQuestionIndex + 1}/{currentBatch.length}
            </span>
            <span className="text-sm font-medium text-neutral-600">
               Questão feitas - {totalAnswered - 1}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <h2 className="text-2xl font-extrabold text-[#005345] mb-6">
          Questão {currentQuestionIndex + 1}
        </h2>

        <div className="rich-text-content mb-8">{parse(currentQuestion.text)}</div>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => (
            <button
              key={option.id}
              className={`flex items-center w-full p-4 text-left rounded-xl transition-all ${
                selectedAnswers[currentQuestion.id] === option.id
                  ? "border border-neutral-500 bg-green-50 text-blue-700"
                  : "border border-neutral-200 hover:border-neutral-300 hover:bg-slate-50"
              }`}
              onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
            >
              <span
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                  selectedAnswers[currentQuestion.id] === option.id
                    ? "bg-[#ff7100] text-white"
                    : "bg-slate-100 text-neutral-700"
                }`}
              >
                {String.fromCharCode(97 + index)}
              </span>
              <div className="rich-text-content flex-1 flex items-center">
                {parse(option.text)}
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={() =>
              handleShowConfirmFinish("Finalizar teste", "Tem certeza de que deseja finalizar o teste agora?")
            }
            className="rounded-xl py-6"
            disabled={isSubmitting}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Finalizar Teste
          </Button>
          <Button
            onClick={handleNextQuestion}
            className="rounded-xl bg-[#ff7100] hover:bg-[#ff8f36] py-6"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Enviando..."
              : currentQuestionIndex < currentBatch.length - 1
              ? "Próxima Questão"
              : "Enviar Respostas"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <CelebrationModal
        isOpen={celebrationModal.isOpen}
        onClose={() => {
          setCelebrationModal((prev) => ({ ...prev, isOpen: false }))
          window.scrollTo(0, 0)
        }}
        previousLevel={celebrationModal.previousLevel}
        nextLevel={celebrationModal.nextLevel}
        message={celebrationModal.message}
      />
    </main>
  )
}
