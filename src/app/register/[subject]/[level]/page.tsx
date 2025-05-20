"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Mail, Phone, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function RegistroPage({
  params,
}: {
  params: { subject: string; level: string }
}) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Em um cenário real, você enviaria os dados para o servidor
    // e armazenaria as informações do usuário

    // Redirecionar para a página de teste
    router.push(`/teste/${params.subject}/${params.level}`)
  }

  const getSubjectName = () => {
    const subjects = {
      excel: "Excel",
      powerbi: "PowerBI",
      sql: "SQL",
      python: "Python",
    }
    return subjects[params.subject as keyof typeof subjects] || params.subject
  }

  const getLevelName = () => {
    const levels = {
      iniciante: "Iniciante",
      intermediario: "Intermediário",
      avancado: "Avançado",
      expert: "Expert",
    }
    return levels[params.level as keyof typeof levels] || params.level
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
        <Link
          href={`/nivel/${params.subject}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Seja bem-vindo(a) ao nosso teste de nivelamento!</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-slate-600">
              Teste de {getSubjectName()} - Nível {getLevelName()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-slate-700">
                Nome
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="pl-10 py-6 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
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
              <Label htmlFor="telefone" className="text-slate-700">
                Telefone
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <Phone className="h-5 w-5" />
                </div>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="pl-10 py-6 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Digite seu telefone"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium mt-6 transition-colors"
            >
              Vamos lá! <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
