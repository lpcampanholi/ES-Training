"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Home, Award, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect } from "react"
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
    return "Continue estudando para melhorar seu conhecimento!"
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#005345]">
      <div className="w-full max-w-3xl p-10 bg-white rounded-3xl shadow-md text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-13 h-13 rounded-full bg-green-100 mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#005345] mb-2">Teste concluído</h1>
          <div className="w-65 h-1 bg-[#ff7100] mx-auto mb-4 rounded-full"></div>
          <p className="text-neutral-600">{getMessage()}</p>
        </div>

        <div className="mb-10">
          <p className="text-base text-neutral-500 mb-2">Sua nota no nível atual:</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className={`text-7xl font-bold ${getScoreColor()}`}>{score}</span>
            <span className="text-2xl text-neutral-600">/ 10,0</span>
          </div>
        </div>

        <div className="mb-10">
          <p className="text-base text-neutral-500 mb-2">Nível recomendado:</p>
          <Badge className={`text-lg px-4 py-2 ${getLevelColor(recommendedLevel)}`}>
            {getLevelName(recommendedLevel)}
          </Badge>
          <p className="text-neutral-600 mt-4">{getLevelDescription(recommendedLevel)}</p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <Link href="/">
            <Button variant="outline" className="rounded-xl px-6 py-6 ">
              <Home className="w-5" />
              Voltar para o início
            </Button>
          </Link>
          <Link href="/disciplinas">
            <Button variant="outline" className="rounded-xl px-6 py-6 ">
              <Award className="w-5" />
              Fazer outro teste
            </Button>
          </Link>

        </div>
      </div>
    </main>
  )
}
