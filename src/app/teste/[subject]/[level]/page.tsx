"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Clock, ImageIcon } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

// Simulação de perguntas
const getQuestions = (subject: string, level: string) => {
  return [
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      options: [
        { id: "a", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        { id: "b", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        { id: "c", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        { id: "d", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
        { id: "e", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
      ],
      correctAnswer: "a",
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit?",
      options: [
        { id: "a", text: "Opção 1" },
        { id: "b", text: "Opção 2" },
        { id: "c", text: "Opção 3" },
        { id: "d", text: "Opção 4" },
        { id: "e", text: "Opção 5" },
      ],
      correctAnswer: "b",
    },
    {
      id: 3,
      text: "Qual a resposta correta para esta pergunta?",
      options: [
        { id: "a", text: "Esta não é a resposta correta" },
        { id: "b", text: "Esta também não é a resposta correta" },
        { id: "c", text: "Esta é a resposta correta" },
        { id: "d", text: "Esta não é a resposta correta" },
        { id: "e", text: "Esta não é a resposta correta" },
      ],
      correctAnswer: "c",
    },
  ]
}

export default function TestePage({
  params,
}: {
  params: { subject: string; level: string }
}) {
  const router = useRouter()
  const questions = getQuestions(params.subject, params.level)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(1200) // 20 minutos em segundos
  const totalQuestions = questions.length

  useEffect(() => {
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
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleSelectAnswer = (questionId: number, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
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

  const finishTest = () => {
    // Calcular pontuação
    let correctAnswers = 0
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const score = (correctAnswers / questions.length) * 10
    const formattedScore = score.toFixed(1).replace(".", ",")

    // Redirecionar para a página de resultados
    router.push(`/resultado?score=${formattedScore}`)
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  const getSubjectName = () => {
    const subjects = {
      excel: "Excel",
      powerbi: "PowerBI",
      sql: "SQL",
      python: "Python",
    }
    return subjects[params.subject as keyof typeof subjects] || params.subject
  }

  const getLevelName = () => {
    const levels = {
      iniciante: "Iniciante",
      intermediario: "Intermediário",
      avancado: "Avançado",
      expert: "Expert",
    }
    return levels[params.level as keyof typeof levels] || params.level
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-medium text-slate-700 bg-slate-100 px-4 py-2 rounded-full">
            {getSubjectName()} - Nível {getLevelName()}
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
              {currentQuestion + 1}/{totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Questão {currentQuestion + 1}</h2>

        <div className="mb-8">
          <p className="text-slate-700 mb-6 leading-relaxed">{question.text}</p>

          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md h-48 bg-slate-100 flex items-center justify-center rounded-xl">
              <ImageIcon className="w-12 h-12 text-slate-400" />
            </div>
          </div>

          <div className="space-y-3">
            {question.options.map((option) => (
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
                  {option.id}
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
          <Button onClick={handleNext} className="rounded-xl bg-blue-600 hover:bg-blue-700">
            {currentQuestion < questions.length - 1 ? (
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
