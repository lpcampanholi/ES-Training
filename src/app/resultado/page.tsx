"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Home, Award, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getLevelName, getLevelColor, getLevelDescription } from "@/utils"
import { Level } from "@/types/prisma"

export default function ResultadoPage() {
  const searchParams = useSearchParams()
  const score = searchParams.get("score") || "0,0"
  const testId = searchParams.get("testId")
  const recommendedLevel = (searchParams.get("level") || "fundamental") as Level
  const scoreNum = Number.parseFloat(score.replace(",", "."))

  useEffect(() => {
    // Dispara confetti quando a página carrega
    if (scoreNum >= 8.0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }, [scoreNum])

  const getScoreColor = () => {
    if (scoreNum >= 8) return "text-green-600"
    if (scoreNum >= 6) return "text-blue-600"
    if (scoreNum >= 4) return "text-amber-600"
    return "text-red-600"
  }

  const getMessage = () => {
    if (scoreNum >= 8) return "Excelente! Você demonstrou um ótimo conhecimento!"
    if (scoreNum >= 6) return "Muito bom! Você tem um bom conhecimento!"
    if (scoreNum >= 4) return "Bom! Você tem conhecimento básico neste nível."
    return "Continue estudando para melhorar seu conhecimento."
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-3xl p-10 bg-white rounded-3xl shadow-md text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mx-auto mb-4">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Teste concluído</h1>
          <p className="text-slate-600 text-lg">{getMessage()}</p>
        </div>

        <div className="mb-10">
          <p className="text-base text-slate-500 mb-2">Sua nota final</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className={`text-7xl font-bold ${getScoreColor()}`}>{score}</span>
            <span className="text-2xl text-slate-600">/ 10,0</span>
          </div>
        </div>

        <div className="mb-10">
          <p className="text-base text-slate-500 mb-2">Nível recomendado</p>
          <Badge className={`text-lg px-4 py-2 ${getLevelColor(recommendedLevel)}`}>
            {getLevelName(recommendedLevel)}
          </Badge>
          <p className="text-slate-600 mt-4">{getLevelDescription(recommendedLevel)}</p>
          <Link href={`https://excelsolutions.com.br/formacao/${recommendedLevel}`} target="_blank">
            <Button className="mt-6 w-full max-w-sm bg-blue-600 hover:bg-blue-700 mx-auto">
              Matricular-se no nível {getLevelName(recommendedLevel)}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <Link href="/disciplinas">
            <Button className="rounded-xl bg-green-600 hover:bg-green-700 px-6 py-6 h-auto">
              <Award className="w-5 h-5 mr-2" />
              Fazer outro teste
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-xl px-6 py-6 h-auto">
              <Home className="w-5 h-5 mr-2" />
              Voltar para o início
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
