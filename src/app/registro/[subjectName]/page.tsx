"use client"

import type React from "react"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Mail, Phone, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { LeadService } from "@/services/lead-service"
import { SubjectService } from "@/services/subject-service"
import { SubjectUI } from "@/types"
import { Level } from "@/types/prisma"
import { CreateLeadDTO } from "@/types/dtos"

export default function RegistroPage({
  params,
}: {
  params: Promise<{ subjectName: Level }>
}) {
  const router = useRouter()
  const { subjectName } = use(params)
  const [isLoading, setIsLoading] = useState(false)
  const [subject, setSubject] = useState<SubjectUI | null>(null)

  const [formData, setFormData] = useState<CreateLeadDTO>({
    name: "",
    email: "",
    phone: "",
  })

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
  }, [subjectName, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await LeadService.createLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      })
      router.push(
        `/instrucoes/${subjectName}?email=${encodeURIComponent(formData.email)}&nome=${encodeURIComponent(formData.name)}`,
      )
    } catch (error) {
      toast("Erro", {
        description: error instanceof Error ? error.message : "Ocorreu um erro ao registrar seus dados",
      })
      setIsLoading(false)
    }
  }

  if (!subject) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#005345]">
        <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
            <div className="text-center py-10">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#005345]">
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
        <Link
          href="/disciplinas"
          className="inline-flex items-center text-[#005345] hover:text-[#3e9b8c] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-[#005345] mb-2">Olá!</h2>
            <div className="w-40 h-1 bg-[#ff7100] mx-auto mb-4 rounded-full"></div>
            <p className="text-neutral-600">
              Seja bem-vindo(a) ao nosso teste de <span className={`text-${subject.color} font-semibold`}>{subject.name}!</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 flex flex-col">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-neutral-700">
                Nome
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 py-6 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-700">
                E-mail
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 py-6 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-neutral-700">
                Telefone
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <Phone className="h-5 w-5" />
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="number"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="pl-10 py-6 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Digite seu telefone"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-[200px] py-6 rounded-xl bg-[#ff7100] hover:bg-[#ff8f36] text-white font-medium mt-6 mx-auto transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                "Processando..."
              ) : (
                <>
                  Vamos lá! <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
