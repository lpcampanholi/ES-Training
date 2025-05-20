"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Home, Share2 } from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect } from "react"

export default function ResultadoPage() {
  const searchParams = useSearchParams()
  const score = searchParams.get("score") || "0,0"
  const testId = searchParams.get("testId")
  const scoreNum = Number.parseFloat(score.replace(",", "."))

  useEffect(() => {
    // Dispara confetti quando a página carrega
    if (scoreNum > 7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [scoreNum])

  const getScoreColor = () => {
    if (scoreNum >= 9) return "text-green-600"
    if (scoreNum >= 7) return "text-blue-600"
    if (scoreNum >= 5) return "text-amber-600"
    return "text-red-600"
  }

  const getMessage = () => {
    if (scoreNum >= 9) return "Excelente! Você domina o assunto!"
    if (scoreNum >= 7) return "Muito bom! Você tem um bom conhecimento!"
    if (scoreNum >= 5) return "Bom! Você tem conhecimento básico."
    return "Continue estudando para melhorar seu conhecimento."
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-4">Parabéns por concluir o teste!</h2>
          <p className="text-slate-600 mb-8">{getMessage()}</p>

          <div className="mb-2">Sua nota final é</div>

          <div className="text-center mb-10">
            <span className={`text-8xl font-bold ${getScoreColor()}`}>{score}</span>
            <span className="text-2xl ml-2 text-slate-600">/ 10,0</span>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/">
              <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-6 h-auto">
                <Home className="w-5 h-5 mr-2" />
                Voltar para o início
              </Button>
            </Link>

            <Button variant="outline" className="rounded-xl px-6 py-6 h-auto">
              <Share2 className="w-5 h-5 mr-2" />
              Compartilhar resultado
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
