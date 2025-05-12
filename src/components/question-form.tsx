"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

const defaultOptions = [
  { id: "", text: "", isCorrect: false, order: "a" },
  { id: "", text: "", isCorrect: false, order: "b" },
  { id: "", text: "", isCorrect: false, order: "c" },
  { id: "", text: "", isCorrect: false, order: "d" },
  { id: "", text: "", isCorrect: false, order: "e" },
]

export default function QuestionForm({
  initialData,
  onSubmit,
  isEditing = false,
}: {
  initialData?: any
  onSubmit: (data: any) => void
  isEditing?: boolean
}) {
  const [formData, setFormData] = useState({
    text: initialData?.text || "",
    imageUrl: initialData?.imageUrl || "",
    options: initialData?.options || defaultOptions,
  })

  const handleTextChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      text: value,
    }))
  }

  const handleOptionChange = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const newOptions = [...prev.options]

      // Se estamos alterando o campo isCorrect para true, precisamos desmarcar as outras opções
      if (field === "isCorrect" && value === true) {
        newOptions.forEach((option, i) => {
          if (i !== index) {
            option.isCorrect = false
          }
        })
      }

      newOptions[index] = {
        ...newOptions[index],
        [field]: value,
      }

      return {
        ...prev,
        options: newOptions,
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar se pelo menos uma opção está marcada como correta
    const hasCorrectOption = formData.options.some((option) => option.isCorrect)

    if (!hasCorrectOption) {
      alert("É necessário marcar pelo menos uma opção como correta")
      return
    }

    // Validar se todas as opções têm texto
    const allOptionsHaveText = formData.options.every((option) => option.text.trim() !== "")

    if (!allOptionsHaveText) {
      alert("Todas as opções devem ter um texto")
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100">{option.order}</div>
            </div>
            <div className="col-span-9">
              <Input
                value={option.text}
                onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                placeholder={`Alternativa ${option.order}`}
                required
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Switch
                checked={option.isCorrect}
                onCheckedChange={(checked) => handleOptionChange(index, "isCorrect", checked)}
              />
              <Label className="cursor-pointer">Correta</Label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit">{isEditing ? "Salvar Alterações" : "Adicionar Questão"}</Button>
      </div>
    </form>
  )
}
