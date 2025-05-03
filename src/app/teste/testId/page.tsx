"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Clock, ImageIcon } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { getTestById, submitTest } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { formatTime } from "@/lib/utils"

export default function TestePage({
  params,
}: {
  params: { testId: string }
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userEmail = searchParams.get("email")
  const { toast } = useToast()

  const [test, setTest] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(1200) // 20 minutos em segundos
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await getTestById(params.testId)
        setTest(data)
        setTimeLeft(data.timeLimit || 1200)
      } catch (err) {
        setError("Erro ao carregar teste")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTest()
  }, [params.testId])

  useEffect(() => {
    if (!test) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          finishTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [test])

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      finishTest()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const finishTest = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      // Preparar as respostas para envio
      const answers = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      }))

      // Enviar as respostas
      const result = await submitTest({
        userId: userEmail || "anonymous", // Idealmente, usaríamos um ID de usuário real
        testId: params.testId,
        answers,
      })

      // Redirecionar para a página de resultados
      router.push(`/resultado?score=${result.score.toFixed(1).replace(".", ",")}&testId=${params.testId}`)
    } catch (error: any) {
      toast({
        title: "Erro ao enviar teste",
        description: error.message || "Ocorreu um erro ao enviar suas respostas",
        variant: "destructive",
      })
      setIsSubmitting(false)
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

  if (error || !test) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
          <div className="text-center py-10 text-red-500">{error || "Teste não encontrado"}</div>
        </div>
      </main>
    )
  }

  const question = test.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / test.questions.length) * 100

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-medium text-slate-700 bg-slate-100 px-4 py-2 rounded-full">
            {test.subject.name} - Nível {test.level}
          </div>
          <div className="flex items-center text-sm font-medium text-slate-700 bg-slate-100 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4 mr-2 text-blue-600" />
            Tempo restante: {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600">Progresso</span>
            <span className="text-sm font-medium text-slate-600">
              {currentQuestion + 1}/{test.questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Questão {currentQuestion + 1}</h2>

        <div className="mb-8">
          <p className="text-slate-700 mb-6 leading-relaxed">{question.text}</p>

          {question.imageUrl && (
            <div className="flex justify-center mb-8">
              <img
                src={question.imageUrl || "/placeholder.svg"}
                alt="Imagem da questão"
                className="max-h-64 object-contain rounded-xl"
              />
            </div>
          )}

          {!question.imageUrl && (
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-md h-48 bg-slate-100 flex items-center justify-center rounded-xl">
                <ImageIcon className="w-12 h-12 text-slate-400" />
              </div>
            </div>
          )}

          <div className="space-y-3">
            {question.options.map((option: any) => (
              <button
                key={option.id}
                className={`w-full p-4 text-left rounded-xl transition-all ${
                  selectedAnswers[question.id] === option.id
                    ? "border-2 border-blue-500 bg-blue-50 text-blue-700"
                    : "border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
                onClick={() => handleSelectAnswer(question.id, option.id)}
              >
                <span
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                    selectedAnswers[question.id] === option.id
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {option.order}
                </span>
                {option.text}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline" className="rounded-xl">
                Sair
              </Button>
            </Link>
            {currentQuestion > 0 && (
              <Button variant="outline" onClick={handlePrevious} className="rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
            )}
          </div>
          <Button onClick={handleNext} className="rounded-xl bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
            {isSubmitting ? (
              "Enviando..."
            ) : currentQuestion < test.questions.length - 1 ? (
              <>
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              "Finalizar"
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}
