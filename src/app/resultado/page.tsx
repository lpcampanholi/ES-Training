"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Home, Share2, Award, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ResultadoPage() {
  const searchParams = useSearchParams()
  const score = searchParams.get("score") || "0,0"
  const testId = searchParams.get("testId")
  const recommendedLevel = searchParams.get("level") || "fundamental"
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
    if (scoreNum >= 9) return "text-green-600"
    if (scoreNum >= 7) return "text-blue-600"
    if (scoreNum >= 5) return "text-amber-600"
    return "text-red-600"
  }

  const getMessage = () => {
    if (scoreNum >= 9) return "Excelente! Você demonstrou um ótimo conhecimento!"
    if (scoreNum >= 7) return "Muito bom! Você tem um bom conhecimento!"
    if (scoreNum >= 5) return "Bom! Você tem conhecimento básico."
    return "Continue estudando para melhorar seu conhecimento."
  }

  const getLevelBadge = (level: string) => {
    let color = ""

    switch (level) {
      case "fundamental":
        color = "bg-green-100 text-green-800"
        break
      case "essencial":
        color = "bg-blue-100 text-blue-800"
        break
      case "avancado":
        color = "bg-purple-100 text-purple-800"
        break
      case "profissional":
        color = "bg-amber-100 text-amber-800"
        break
      default:
        color = "bg-gray-100 text-gray-800"
    }

    return <Badge className={color}>{getLevelName(level)}</Badge>
  }

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

  const getLevelDescription = (level: string) => {
    switch (level) {
      case "fundamental":
        return "Neste nível, você aprenderá os conceitos básicos e fundamentos essenciais para iniciar sua jornada."
      case "essencial":
        return "Neste nível, você aprofundará seus conhecimentos e aprenderá técnicas mais avançadas."
      case "avancado":
        return "Neste nível, você dominará técnicas avançadas e resolverá problemas complexos."
      case "profissional":
        return "Neste nível, você se tornará um especialista com habilidades de nível profissional."
      default:
        return "Aprenda mais sobre este nível na Formação SmartES."
    }
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

          <div className="mb-6 flex items-center gap-2">{getLevelBadge(recommendedLevel)}</div>

          <div className="mb-2">Sua nota final é</div>

          <div className="text-center mb-10">
            <span className={`text-8xl font-bold ${getScoreColor()}`}>{score}</span>
            <span className="text-2xl ml-2 text-slate-600">/ 10,0</span>
          </div>

          <Card className="w-full max-w-md mb-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-bold text-blue-800 text-xl mb-2">Recomendação de Nível</h3>
              <p className="text-blue-700 mb-4">
                Com base no seu desempenho, recomendamos que você se matricule no nível:
              </p>
              <div className="bg-white p-4 rounded-lg mb-4">
                <h4 className="font-bold text-lg mb-1">{getLevelName(recommendedLevel)}</h4>
                <p className="text-slate-600">{getLevelDescription(recommendedLevel)}</p>
              </div>
              <Link href={`https://excelsolutions.com.br/formacao/${recommendedLevel}`} target="_blank">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Matricular-se no nível {getLevelName(recommendedLevel)}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/iniciar">
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

            {/* <Button variant="outline" className="rounded-xl px-6 py-6 h-auto">
              <Share2 className="w-5 h-5 mr-2" />
              Compartilhar resultado
            </Button> */}
          </div>
        </div>
      </div>
    </main>
  )
}
