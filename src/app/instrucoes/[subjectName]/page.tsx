"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Brain, Award } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { TestService } from "@/services/test-service"
import { SubjectService } from "@/services/subject-service"
import type { SubjectUI } from "@/types"
import { Level, Subject } from "@/types/prisma"

export default function InstrucoesPage({
  params,
}: {
  params: Promise<{ subjectName: string }>
}) {
  const router = useRouter()
  const { subjectName } = use(params)
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const nome = searchParams.get("nome") || ""
  const [isLoading, setIsLoading] = useState(false)
  const [subject, setSubject] = useState<SubjectUI | null>(null)

  useEffect(() => {
    const subjectData = SubjectService.getSubjectUIById(subjectName)
    if (!subjectData) {
      toast("Erro", {
        description: "Disciplina não encontrada",
      })
      router.push("/disciplinas")
      return
    }
    setSubject(subjectData)
  }, [subjectName, router])

  const handleStartTest = async () => {
    if (!email) {
      toast("Erro", {
        description: "Email não encontrado. Por favor, volte e preencha seus dados.",
      })
      return
    }
    setIsLoading(true)
    try {
      const testData = await TestService.generateTest({
        subject: subjectName as Subject,
        level: "fundamental" as Level,
        leadEmail: email,
      })
      router.push(`/teste/${testData.testId}`)
    } catch (error) {
      toast("Erro", {
        description: error instanceof Error ? error.message : "Ocorreu um erro ao iniciar o teste",
      })
      setIsLoading(false)
    }
  }

  if (!subject) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
          <div className="text-center py-10">Carregando...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
        <Link
          href={`/registro/${subjectName}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Instruções do Teste</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-slate-600">
              Olá, <span className="font-semibold">{nome}</span>! Veja como funciona o teste de{" "}
              <span className={`text-${subject.color} font-semibold`}>{subject.name}:</span>
            </p>
          </div>

          <div className="mb-8 p-8">
              <div className="space-y-8">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Teste adaptativo</p>
                    <p className="text-slate-600">
                      O teste se adapta ao seu nível de conhecimento, ficando mais difícil conforme você
                      vai passando de nível.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Níveis progressivos</p>
                    <p className="text-slate-600">
                      O teste possui 4 níveis: Fundamental, Essencial, Avançado e Profissional. Você avança de nível ao
                      atingir média 8.0 ou superior.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Responda com atenção</p>
                    <p className="text-slate-600">
                      Cada questão possui 4 alternativas com diferentes valores. Escolha a que melhor responde à
                      pergunta.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Tempo limitado</p>
                    <p className="text-slate-600">
                      Você terá 20 minutos para completar o teste. Fique atento ao contador no topo da tela.
                    </p>
                  </div>
                </div>
              </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-xl font-bold mb-2">Pronto para começar?</h3>
            <p className="text-slate-600">Clique no botão abaixo para iniciar seu teste de nivelamento.</p>
          </div>

          <Button
            onClick={handleStartTest}
            className="py-6 px-8 w-[200px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              "Preparando teste..."
            ) : (
              <>
                Iniciar Teste <ArrowRight className="ml-1 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}
