"use client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useSubjects } from "@/hooks/use-subjects"
import { Loader2 } from "lucide-react"

export default function DisciplinasPage() {
  const { subjects, isLoading, error } = useSubjects()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#005345]">
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl min-h-[85vh] shadow-sm flex flex-col justify-center">
        <Link href="/" className="inline-flex items-center text-[#005345] hover:text-[#3e9b8c] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>

        <div className="flex flex-col items-center justify-center py-6 flex-1">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-[#005345] mb-2">Disciplinas</h2>
            <div className="w-45 h-1 bg-[#ff7100] mx-auto mb-4 rounded-full"></div>
            <p className="text-neutral-600">Selecione a disciplina para iniciar seu teste de nivelamento:</p>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-3xl">
              {subjects.map((subject) => (
                <Link key={subject.id} href={`/registro/${subject.id}`} className="block">
                  <Card className="h-60 rounded-xl border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
                    <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div
                        className={`w-16 h-16 bg-${subject.color.split("-")[0]}-100 text-${subject.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <subject.icon className="w-8 h-8" />
                      </div>
                      <span className="text-xl font-bold mb-1">{subject.name}</span>
                      <span className={`text-lg font-semibold text-${subject.color}`}>{subject.description}</span>
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
