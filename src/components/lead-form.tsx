"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { LeadFormData } from "@/types"
import type { Lead, Subject, Level, LeadStage } from "@/types/prisma"

interface LeadFormProps {
  lead?: Lead
  onSubmit: (data: LeadFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function LeadForm({
  lead,
  onSubmit,
  onCancel,
  isSubmitting = false
}: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    testLevel: lead?.testLevel || null,
    testSubject: lead?.testSubject || null,
    fromTest: lead?.fromTest || false,
    stage: lead?.stage as LeadStage || "PENDENTE",
    observations: lead?.observations || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof LeadFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stage">Etapa</Label>
          <Select value={formData.stage} onValueChange={(value) => handleInputChange("stage", value as LeadStage)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a etapa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDENTE">Pendente</SelectItem>
              <SelectItem value="CONTRATADO">Contratado</SelectItem>
              <SelectItem value="CONVERTIDO">Convertido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="testSubject">Disciplina do Teste</Label>
          <Select
            value={formData.testSubject || ""}
            onValueChange={(value) => handleInputChange("testSubject", (value as Subject) || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a disciplina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhuma</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="powerbi">Power BI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="testLevel">Nível do Teste</Label>
          <Select
            value={formData.testLevel || ""}
            onValueChange={(value) => handleInputChange("testLevel", (value as Level) || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              <SelectItem value="fundamental">Fundamental</SelectItem>
              <SelectItem value="essencial">Essencial</SelectItem>
              <SelectItem value="avancado">Avançado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="fromTest"
          checked={formData.fromTest}
          onCheckedChange={(checked) => handleInputChange("fromTest", checked)}
        />
        <Label htmlFor="fromTest">Veio do teste de nivelamento</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observations">Observações</Label>
        <Textarea
          id="observations"
          value={formData.observations}
          onChange={(e) => handleInputChange("observations", e.target.value)}
          rows={4}
          placeholder="Adicione observações sobre este lead..."
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : lead ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  )
}
