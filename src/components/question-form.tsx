"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { QuestionFormData } from "@/types"
import { Subject, Level } from "@/types/prisma"
import { Input } from "./ui/input"

interface QuestionFormProps {
  initialData?: Partial<QuestionFormData>
  onSubmit: (data: QuestionFormData) => void
  isEditing?: boolean
  onCancel: () => void
}

export default function QuestionForm({
  initialData,
  onSubmit,
  isEditing = false,
  onCancel,
}: QuestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<QuestionFormData>({
    text: initialData?.text || "",
    subject: initialData?.subject || Subject.excel,
    level: initialData?.level || Level.essencial,
    options: initialData?.options || [
      { text: "", value: 0.0 },
      { text: "", value: 0.0 },
      { text: "", value: 0.0 },
      { text: "", value: 0.0 },
    ],
  })

  const handleTextChange = (value: string): void => {
    setFormData((prev) => ({
      ...prev,
      text: value,
    }))
  }

  const handleOptionTextChange = (index: number, value: string): void => {
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

  const handleOptionValueChange = (index: number, value: number): void => {
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

  const handleSelectChange = (field: keyof Pick<QuestionFormData, "subject" | "level">, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent): void => {
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
      <div className="flex gap-4">
        <div className="space-y-2">
          <Select value={formData.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a disciplina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Subject.excel}>Excel</SelectItem>
              <SelectItem value={Subject.sql}>SQL</SelectItem>
              <SelectItem value={Subject.python}>Python</SelectItem>
              <SelectItem value={Subject.powerbi}>Power BI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Select value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Level.fundamental}>Fundamental</SelectItem>
              <SelectItem value={Level.essencial}>Essencial</SelectItem>
              <SelectItem value={Level.avancado}>Avançado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Enunciado</Label>
        <RichTextEditor
          value={formData.text}
          onChange={handleTextChange}
          placeholder="Digite o enunciado da questão..."
        />
      </div>

      <div className="space-y-4">
        <Label>Alternativas</Label>
        {formData.options.map((option, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100">{index + 1}</div>
            </div>
            <div className="col-span-8">
              <Input
                value={option.text}
                onChange={(e) => handleOptionTextChange(index, e.target.value)}
                placeholder={`Alternativa ${index + 1}`}
              />
            </div>
            <div className="col-span-3 w-full">
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

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : isEditing ? "Salvar Alterações" : "Adicionar Questão"}
        </Button>
      </div>
    </form>
  )
}
