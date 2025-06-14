"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Brain, Award, Loader2 } from "lucide-react"
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
    <div className="text-center p-4 min-h-screen bg-[#005345]">
      <div className="flex justify-center py-10">
        <Loader2 className="w-7 h-7 animate-spin text-white" />
      </div>
    </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#005345]">
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
        {/* <Link
          href={`/registro/${subjectName}`}
          className="inline-flex items-center text-[#005345] hover:text-[#3e9b8c] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link> */}

        <div className="flex flex-col items-center justify-center py-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-[#005345] mb-2">Instruções</h2>
            <div className="w-45 h-1 bg-[#ff7100] mx-auto mb-4 rounded-full"></div>
            <p className="text-neutral-600">
              Olá, <span className="font-semibold">{nome}</span>! Veja como funciona o teste de{" "}
              <span className={`text-${subject.color} font-semibold`}>{subject.name}:</span>
            </p>
          </div>

          <div className="space-y-8 mb-10">
            <div className="flex items-center gap-3 flex-col sm:flex-row">
              <div className="bg-blue-100 p-2 rounded-full">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <div className="mt-2 sm:mt-0 text-center sm:text-left">
                <p className="font-bold text-lg sm:text-base text-[#005345]">Teste adaptativo</p>
                <p className="text-neutral-600">
                  O teste se adapta ao seu nível de conhecimento, ficando mais difícil conforme você
                  vai passando de nível.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-col sm:flex-row">
              <div className="bg-green-100 p-2 rounded-full">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div className="mt-2 sm:mt-0 text-center sm:text-left">
                <p className="font-bold text-lg sm:text-base text-[#005345]">Níveis progressivos</p>
                <p className="text-neutral-600">
                  O teste possui 3 níveis: Fundamental, Essencial e Avançado. Você avança de nível ao
                  atingir média 8.0 ou superior.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-col sm:flex-row">
              <div className="bg-amber-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="mt-2 sm:mt-0 text-center sm:text-left">
                <p className="font-bold text-lg sm:text-base text-[#005345]">Responda com atenção</p>
                <p className="text-neutral-600">
                  Cada questão possui 4 alternativas com diferentes valores. Escolha a que melhor responde à
                  pergunta.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-col sm:flex-row">
              <div className="bg-purple-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div className="mt-2 sm:mt-0 text-center sm:text-left">
                <p className="font-bold text-lg sm:text-base text-[#005345]">Tempo limitado</p>
                <p className="text-neutral-600">
                  Você terá 20 minutos para completar o teste. Fique atento ao contador no topo da tela.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-xl font-extrabold text-[#005345] mb-2">Pronto para começar?</h3>
            <p className="text-neutral-600">Clique no botão abaixo para iniciar seu teste de nivelamento.</p>
          </div>

          <Button
            onClick={handleStartTest}
            className="py-6 px-8 w-full sm:w-[200px] rounded-xl bg-[#ff7100] hover:bg-[#ff8f36] text-white font-medium transition-colors"
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
