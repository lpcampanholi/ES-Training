"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, BarChart3, Database, Code, FileSpreadsheet } from "lucide-react"
// import { getSubjects } from "@/services/api"

export default function NivelPage() {
  const [subjects, setSubjects] = useState<any[]>([])
  // const [isLoading, setIsLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)

  // useEffect(() => {
  //   const fetchSubjects = async () => {
  //     try {
  //       const data = await getSubjects()
  //       console.log("Data: ", data)
  //       if (data) setSubjects(data) // aqui loga o array de disciplinas
  //     } catch (err) {
  //       setError("Erro ao carregar disciplinas")
  //       console.error(err)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }
  //   fetchSubjects()
  // }, [])

  const hardSubjects = [
    {
      id: "excel",
      name: "Excel",
      icon: FileSpreadsheet,
      color: "green-600",
      description: "Análise",
    },
    {
      id: "python",
      name: "Python",
      icon: Code,
      color: "blue-600",
      description: "Manipulação",
    },
    {
      id: "sql",
      name: "SQL",
      icon: Database,
      color: "amber-600",
      description: "Captação",
    },
    {
      id: "power-bi",
      name: "Power BI",
      icon: BarChart3,
      color: "purple-600",
      description: "Apresentação",
    }
  ]

  useEffect(() => {
    setSubjects(hardSubjects)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Disciplinas</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-slate-600">Selecione a Disciplina</p>
          </div>

          {/* {isLoading ? (
            <div className="text-center py-10"><Loader2 className="animate-spin" /></div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : ( */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-3xl">
            {subjects.map((subject) => {
              return (
                <Link key={subject.id} href={`/nivel/${subject.id}`} className="block">
                  <Card className={`h-48 rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden group`}>
                    <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div
                        className={`w-16 h-16 text-${subject.color} bg-${subject.color}/50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <subject.icon className="w-8 h-8" />
                      </div>
                      <span className="text-xl font-bold mb-1">{subject.name.toUpperCase()}</span>
                      <span className={`text-lg font-semibold text-${subject.color}`}>{subject.description}</span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
          {/* )} */}
        </div>
      </div>
    </main>
  )
}
