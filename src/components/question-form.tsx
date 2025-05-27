"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Input } from "./ui/input"

// Valores possíveis para as opções
const optionValues = [0.0, 4.0, 7.0, 10.0]

export default function QuestionForm({
  initialData,
  onSubmit,
  isEditing = false,
}: {
  initialData?: any
  onSubmit: (data: any) => void
  isEditing?: boolean
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    text: initialData?.text || "",
    subject: initialData?.subject || "excel",
    level: initialData?.level || "fundamental",
    options: initialData?.options || [
      { id: "", text: "", value: 0.0 },
      { id: "", text: "", value: 0.0 },
      { id: "", text: "", value: 0.0 },
      { id: "", text: "", value: 0.0 },
    ],
  })

  const handleTextChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      text: value,
    }))
  }

  const handleOptionTextChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newOptions = [...prev.options]
      newOptions[index] = {
        ...newOptions[index],
        text: value,
      }
      return {
        ...prev,
        options: newOptions,
      }
    })
  }

  const handleOptionValueChange = (index: number, value: number) => {
  setFormData((prev) => {
    const newOptions = [...prev.options]
    newOptions[index] = {
      ...newOptions[index],
      value,
    }
    return {
      ...prev,
      options: newOptions,
    }
  })
}

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar se todas as opções têm texto
    const allOptionsHaveText = formData.options.every((option) => option.text.trim() !== "")
    if (!allOptionsHaveText) {
      alert("Todas as opções devem ter um texto")
      return
    }

    // Validar se pelo menos uma opção tem valor 10.0 (totalmente correta)
    const hasCorrectOption = formData.options.some((option) => option.value === 10.0)
    if (!hasCorrectOption) {
      alert("Pelo menos uma opção deve ser totalmente correta (valor 10.0)")
      return
    }
    setIsSubmitting(true)
    onSubmit(formData)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="subject">Disciplina</Label>
          <Select value={formData.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
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

        <div className="space-y-2">
          <Label htmlFor="level">Nível</Label>
          <Select value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fundamental">Fundamental</SelectItem>
              <SelectItem value="essencial">Essencial</SelectItem>
              <SelectItem value="avancado">Avançado</SelectItem>
              <SelectItem value="profissional">Profissional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Enunciado da Questão</Label>
          <RichTextEditor
            value={formData.text}
            onChange={handleTextChange}
            placeholder="Digite o enunciado da questão..."
          />
        <p className="text-sm text-slate-500 mt-1">
          Use o editor acima para formatar o texto, adicionar imagens, tabelas e outros elementos.
        </p>
      </div>

      <div className="space-y-4">
        <Label>Alternativas (4 opções)</Label>
        {formData.options.map((option, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100">{index + 1}</div>
            </div>
            <div className="col-span-8">
              <Input
                value={option.text}
                onChange={(e) => handleOptionTextChange(index, e.target.value)}
                placeholder={`Texto da opção ${index + 1}`}
              />
            </div>
            <div className="col-span-3">
              <Select
                value={option.value.toString()}
                onValueChange={(value) => handleOptionValueChange(index, Number.parseFloat(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Valor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Totalmente errada (0.0)</SelectItem>
                  <SelectItem value="4">Parcialmente certa (4.0)</SelectItem>
                  <SelectItem value="7">Quase certa (7.0)</SelectItem>
                  <SelectItem value="10">Totalmente certa (10.0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          {isEditing ? "Salvar Alterações" : "Adicionar Questão"}
        </Button>
      </div>
    </form>
  )
}
