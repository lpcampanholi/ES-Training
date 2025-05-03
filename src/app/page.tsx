"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Database, FileSpreadsheet, BarChart3, Code } from "lucide-react"
import { getSubjects } from "@/services/api"

export default function Home() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects()
        setSubjects(data)
      } catch (err) {
        setError("Erro ao carregar disciplinas")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  // Fallback para quando não há dados do banco ainda
  const defaultSubjects = [
    { id: "excel", name: "Excel", icon: FileSpreadsheet, color: "bg-emerald-50 text-emerald-600" },
    { id: "powerbi", name: "PowerBI", icon: BarChart3, color: "bg-amber-50 text-amber-600" },
    { id: "sql", name: "SQL", icon: Database, color: "bg-blue-50 text-blue-600" },
    { id: "python", name: "Python", icon: Code, color: "bg-purple-50 text-purple-600" },
  ]

  const displaySubjects =
    subjects.length > 0
      ? subjects.map((subject) => ({
          id: subject.id,
          name: subject.name,
          icon: getIconBySlug(subject.slug),
          color: subject.color || "bg-emerald-50 text-emerald-600",
        }))
      : defaultSubjects

  function getIconBySlug(slug: string) {
    const icons: Record<string, any> = {
      excel: FileSpreadsheet,
      powerbi: BarChart3,
      sql: Database,
      python: Code,
    }
    return icons[slug] || FileSpreadsheet
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Teste online</h1>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Olá! Seja bem-vindo!</h2>
            <p className="text-lg text-slate-600">Que tal descobrir seu nível com a gente?</p>
          </div>

          {isLoading ? (
            <div className="text-center py-10">Carregando...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-3xl">
              {displaySubjects.map((subject) => (
                <Link key={subject.id} href={`/nivel/${subject.id}`} className="block">
                  <Card className="h-48 rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
                    <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div
                        className={`w-16 h-16 ${subject.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <subject.icon className="w-8 h-8" />
                      </div>
                      <span className="text-lg font-semibold text-slate-700">{subject.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
