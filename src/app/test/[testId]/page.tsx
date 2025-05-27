"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { formatTime } from "@/lib/utils"
import parse from "html-react-parser"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TestePage({
  params,
}: {
  params: { testId: string }
}) {
  const router = useRouter()

  const [testData, setTestData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(1200) // 20 minutos em segundos
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentBatch, setCurrentBatch] = useState<any[]>([])
  const [batchNumber, setBatchNumber] = useState(1)
  const [currentLevel, setCurrentLevel] = useState<string>("fundamental")
  const [message, setMessage] = useState<string | null>(null)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [currentAverage, setCurrentAverage] = useState(0)

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        // Buscar o teste inicial
        const response = await fetch(`/api/tests/${params.testId}`)
        if (!response.ok) {
          throw new Error("Erro ao buscar teste")
        }
        const data = await response.json()
        setTestData(data)
        setCurrentBatch(data.questions)
        setCurrentLevel(data.currentLevel)
      } catch (error) {
        setError("Erro ao carregar teste")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestData()
  }, [params.testId])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinishTest()
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

    // Verificar se o usuário selecionou uma resposta para a questão atual
    if (!selectedAnswers[currentQuestion.id]) {
      toast("Selecione uma resposta", {
        description: "Por favor, selecione uma resposta antes de continuar",
      })
      return
    }

    if (currentQuestionIndex < currentBatch.length - 1) {
      // Avançar para a próxima questão no lote atual
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      // Último lote de questões, enviar respostas
      handleSubmitAnswers()
    }
  }

  const handleSubmitAnswers = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submit-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId: params.testId,
          answers: selectedAnswers,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao enviar respostas")
      }

      const data = await response.json()

      if (data.isComplete) {
        // Teste completo, redirecionar para a página de resultados
        router.push(
          `/resultado?score=${data.score.toFixed(1).replace(".", ",")}&testId=${params.testId}&level=${data.recommendedLevel}`,
        )
      } else {
        // Mais questões disponíveis
        setCurrentBatch(data.questions)
        setCurrentQuestionIndex(0)
        setBatchNumber((prev) => prev + 1)
        setAnsweredCount((prev) => prev + currentBatch.length)

        if (data.currentLevel !== currentLevel) {
          setCurrentLevel(data.currentLevel)
          setMessage(data.message || `Você avançou para o nível ${data.currentLevel}!`)
        }

        if (data.currentAverage) {
          setCurrentAverage(data.currentAverage)
        }

        toast(data.passedLevel ? "Parabéns!" : "Próximas questões", {
          description: data.message || `Agora você está respondendo questões do nível ${data.currentLevel}`,
        })
      }
    } catch (error: any) {
      toast("Erro", {
        description: error.message || "Ocorreu um erro ao enviar suas respostas",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinishTest = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submit-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId: params.testId,
          answers: selectedAnswers,
          isComplete: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao finalizar teste")
      }

      const data = await response.json()
      router.push(
        `/resultado?score=${data.score.toFixed(1).replace(".", ",")}&testId=${params.testId}&level=${data.recommendedLevel}`,
      )
    } catch (error: any) {
      toast("Erro ao finalizar teste", {
        description: error.message || "Ocorreu um erro ao finalizar o teste",
      })
      setIsSubmitting(false)
    }
  }

  // Função para obter a cor do badge com base no nível
  const getLevelColor = (level: string) => {
    switch (level) {
      case "fundamental":
        return "bg-green-100 text-green-800"
      case "essencial":
        return "bg-blue-100 text-blue-800"
      case "avancado":
        return "bg-purple-100 text-purple-800"
      case "profissional":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Função para obter o nome formatado do nível
  const getLevelName = (level: string) => {
    switch (level) {
      case "fundamental":
        return "Fundamental"
      case "essencial":
        return "Essencial"
      case "avancado":
        return "Avançado"
      case "profissional":
        return "Profissional"
      default:
        return level
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
          <div className="text-center py-10">Carregando teste...</div>
        </div>
      </main>
    )
  }

  if (error || !testData || currentBatch.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
          <div className="text-center py-10 text-red-500">{error || "Teste não encontrado"}</div>
        </div>
      </main>
    )
  }

  const currentQuestion = currentBatch[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / currentBatch.length) * 100
  const totalAnswered = answeredCount + currentQuestionIndex + 1

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
        {message && (
          <Alert className="mb-6">
            <AlertTitle>Informação</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-slate-700 bg-slate-100 px-4 py-2 rounded-full">
              {currentQuestion.subject === "powerbi" ? "Power BI" : currentQuestion.subject.toUpperCase()}
            </div>
            <Badge className={getLevelColor(currentLevel)}>{getLevelName(currentLevel)}</Badge>
          </div>
          <div className="flex items-center text-sm font-medium text-slate-700 bg-slate-100 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4 mr-2 text-blue-600" />
            Tempo restante: {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600">Progresso do lote atual</span>
            <span className="text-sm font-medium text-slate-600">
              {currentQuestionIndex + 1}/{currentBatch.length} (Questão {totalAnswered} total)
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Questão {totalAnswered}</h2>

        <div className="mb-8">
          <div className="rich-text-content mb-6">{parse(currentQuestion.text)}</div>

          <div className="space-y-3">
            {currentQuestion.options.map((option: any, index: number) => (
              <button
                key={option.id}
                className={`w-full p-4 text-left rounded-xl transition-all ${
                  selectedAnswers[currentQuestion.id] === option.id
                    ? "border-2 border-blue-500 bg-blue-50 text-blue-700"
                    : "border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
                onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
              >
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                    selectedAnswers[currentQuestion.id] === option.id
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {String.fromCharCode(97 + index)} {/* a, b, c, d */}
                </span>
                <div className="inline-block rich-text-content">{parse(option.text)}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleFinishTest} className="rounded-xl" disabled={isSubmitting}>
            <AlertCircle className="w-4 h-4 mr-2" />
            Finalizar Teste
          </Button>
          <Button
            onClick={handleNextQuestion}
            className="rounded-xl bg-blue-600 hover:bg-blue-700"
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
    </main>
  )
}
