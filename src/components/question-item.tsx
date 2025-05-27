"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import QuestionForm from "@/components/question-form"
import parse from "html-react-parser"
import { Badge } from "@/components/ui/badge"

export default function QuestionItem({
  question,
  index,
  onDelete,
  onUpdate,
}: {
  question: any
  index: number
  onDelete: () => void
  onUpdate: (questionId: string, data: any) => void
}) {
  const handleUpdate = (data: any) => {
    onUpdate(question.id, data)
  }

  // Função para obter a cor do badge com base no nível
  const getLevelColor = (level: string) => {
    switch (level) {
      case "fundamental":
        return "bg-green-100 text-green-800"
      case "essencial":
        return "bg-blue-100 text-blue-800"
      case "avancado":
        return "bg-purple-100 text-purple-800"
      case "profissional":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Função para obter a cor do badge com base no valor da opção
  const getValueColor = (value: number) => {
    switch (value) {
      case 0:
        return "bg-red-100 text-red-800"
      case 4:
        return "bg-yellow-100 text-yellow-800"
      case 7:
        return "bg-blue-100 text-blue-800"
      case 10:
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Função para obter o texto do valor da opção
  const getValueText = (value: number) => {
    switch (value) {
      case 0:
        return "Totalmente errada"
      case 4:
        return "Parcialmente certa"
      case 7:
        return "Quase certa"
      case 10:
        return "Totalmente certa"
      default:
        return value.toString()
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">Questão {index + 1}</h3>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline">{question.subject}</Badge>
              <Badge className={getLevelColor(question.level)}>{question.level}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[70%] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Editar Questão</DialogTitle>
                </DialogHeader>
                <QuestionForm initialData={question} onSubmit={handleUpdate} isEditing />
              </DialogContent>
            </Dialog>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <div className="rich-text-content">{parse(question.text)}</div>
        </div>
        <div className="space-y-2">
          {question.options.map((option: any, idx: number) => (
            <div
              key={option.id}
              className={`p-3 border rounded-md ${option.value === 10 ? "border-green-500 bg-green-50" : "border-gray-200"}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium mr-2">{idx + 1})</span>
                  <div className="inline-block rich-text-content">{parse(option.text)}</div>
                </div>
                <Badge className={getValueColor(option.value)}>
                  {getValueText(option.value)} ({option.value})
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
