"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileSpreadsheet, Database, BarChart3, Code } from "lucide-react"
import { toast } from "sonner"

export default function IniciarTestePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    subject: "excel",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Registrar o lead
      const leadResponse = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.nome,
          email: formData.email,
          phone: formData.telefone,
        }),
      })

      if (!leadResponse.ok) {
        const error = await leadResponse.json()
        throw new Error(error.error || "Erro ao registrar usuário")
      }

      // Gerar o teste
      const testResponse = await fetch("/api/generate-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: formData.subject,
          initialLevel: "essencial", // Começar com nível essencial
          userId: formData.email, // Usar o email como identificador do usuário
        }),
      })

      if (!testResponse.ok) {
        const error = await testResponse.json()
        throw new Error(error.error || "Erro ao gerar teste")
      }

      const testData = await testResponse.json()

      // Redirecionar para a página do teste
      router.push(`/test/${testData.testId}`)
    } catch (error: any) {
      toast("Erro", {
        description: error.message || "Ocorreu um erro ao iniciar o teste",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case "excel":
        return <FileSpreadsheet className="h-6 w-6 text-green-600" />
      case "sql":
        return <Database className="h-6 w-6 text-blue-600" />
      case "powerbi":
        return <BarChart3 className="h-6 w-6 text-amber-600" />
      case "python":
        return <Code className="h-6 w-6 text-purple-600" />
      default:
        return <FileSpreadsheet className="h-6 w-6 text-green-600" />
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-sm">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Teste de Nivelamento</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-slate-600">Descubra seu nível de conhecimento e receba um feedback personalizado</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Digite seu e-mail"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                placeholder="Digite seu telefone"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Escolha a disciplina</Label>
              <Select value={formData.subject} onValueChange={(value) => handleChange("subject", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="powerbi">Power BI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center">
                  {getSubjectIcon(formData.subject)}
                  <div className="ml-4">
                    <h3 className="font-semibold">
                      Teste de {formData.subject === "powerbi" ? "Power BI" : formData.subject.toUpperCase()}
                    </h3>
                    <p className="text-sm text-slate-500">O teste se adapta ao seu nível de conhecimento</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              type="submit"
              className="w-full py-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium mt-6 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando..." : "Iniciar Teste"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
