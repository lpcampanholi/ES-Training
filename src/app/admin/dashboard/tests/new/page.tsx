"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { createSlug } from "@/lib/utils"

export default function NewTestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    level: "INICIANTE",
    description: "",
    timeLimit: 1200,
    subjectId: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData((prev) => {
      const newData = { ...prev, [name]: value }

      // Atualizar slug automaticamente quando o título mudar
      if (name === "title") {
        newData.slug = createSlug(value)
      }

      return newData
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao criar teste")
      }

      const test = await response.json()

      toast({
        title: "Teste criado com sucesso!",
        description: "Agora você pode adicionar questões ao teste.",
      })

      router.push(`/admin/tests/${test.id}`)
    } catch (error: any) {
      toast({
        title: "Erro ao criar teste",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para o dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Novo Teste</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Teste</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Excel - Básico"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="ex: excel-basico"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Nível</Label>
                <Select value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INICIANTE">Iniciante</SelectItem>
                    <SelectItem value="INTERMEDIARIO">Intermediário</SelectItem>
                    <SelectItem value="AVANCADO">Avançado</SelectItem>
                    <SelectItem value="EXPERT">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjectId">Disciplina</Label>
                <Select value={formData.subjectId} onValueChange={(value) => handleSelectChange("subjectId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subject1">Excel</SelectItem>
                    <SelectItem value="subject2">PowerBI</SelectItem>
                    <SelectItem value="subject3">SQL</SelectItem>
                    <SelectItem value="subject4">Python</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeLimit">Tempo Limite (segundos)</Label>
                <Input
                  id="timeLimit"
                  name="timeLimit"
                  type="number"
                  value={formData.timeLimit}
                  onChange={handleChange}
                  placeholder="1200 (20 minutos)"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrição do teste"
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar Teste"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
