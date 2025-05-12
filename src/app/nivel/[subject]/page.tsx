"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Sparkles, Zap, Trophy, Star } from "lucide-react"
import { getTestsBySubject } from "@/services/tests-service"

export default function NivelPage({ params }: { params: { subject: string } }) {
  const [tests, setTests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getTestsBySubject(params.subject)
        setTests(data)
      } catch (err) {
        setError("Erro ao carregar testes")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTests()
  }, [params.subject])

  const levels = [
    {
      id: "INICIANTE",
      name: "Iniciante",
      icon: Sparkles,
      color: "bg-green-50 text-green-600",
      description: "Para quem está começando",
    },
    {
      id: "INTERMEDIARIO",
      name: "Intermediário",
      icon: Zap,
      color: "bg-blue-50 text-blue-600",
      description: "Conhecimento médio",
    },
    {
      id: "AVANCADO",
      name: "Avançado",
      icon: Trophy,
      color: "bg-purple-50 text-purple-600",
      description: "Conhecimento avançado",
    },
    {
      id: "EXPERT",
      name: "Expert",
      icon: Star,
      color: "bg-amber-50 text-amber-600",
      description: "Domínio completo",
    },
  ]

  const getSubjectName = () => {
    // Se temos testes, pegamos o nome do subject do primeiro teste
    if (tests.length > 0 && tests[0].subject) {
      return tests[0].subject.name
    }

    // Fallback para quando não temos dados do banco ainda
    const subjects: Record<string, string> = {
      excel: "Excel",
      powerbi: "PowerBI",
      sql: "SQL",
      python: "Python",
    }
    return subjects[params.subject] || params.subject
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
        <Link href="/disciplinas" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Escolha o seu nível</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-slate-600">Selecione o nível para o teste de {getSubjectName()}</p>
          </div>

          {isLoading ? (
            <div className="text-center py-10">Carregando...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-3xl">
              {levels.map((level) => {
                // Verificar se existe um teste para este nível
                const testForLevel = tests.find((test) => test.level === level.id)
                const href = testForLevel ? `/registro/${testForLevel.id}` : `/registro/${params.subject}/${level.id}`

                return (
                  <Link key={level.id} href={href} className="block">
                    <Card className="h-48 rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
                      <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <div
                          className={`w-16 h-16 ${level.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <level.icon className="w-8 h-8" />
                        </div>
                        <span className="text-lg font-semibold text-slate-700 mb-1">{level.name}</span>
                        <span className="text-sm text-slate-500">{level.description}</span>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
