"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import QuestionForm from "@/components/admin/question-form"

export default function QuestionItem({
  question,
  index,
  onDelete,
}: {
  question: any
  index: number
  onDelete: () => void
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg">Questão {index + 1}</h3>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Editar Questão</DialogTitle>
                </DialogHeader>
                <QuestionForm initialData={question} onSubmit={() => {}} isEditing />
              </DialogContent>
            </Dialog>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <p className="whitespace-pre-line">{question.text}</p>
          {question.imageUrl && (
            <div className="mt-2">
              <img
                src={question.imageUrl || "/placeholder.svg"}
                alt="Imagem da questão"
                className="max-h-40 object-contain"
              />
            </div>
          )}
        </div>
        <div className="space-y-2">
          {question.options.map((option: any) => (
            <div
              key={option.id}
              className={`p-3 border rounded-md ${
                option.isCorrect ? "border-green-500 bg-green-50" : "border-gray-200"
              }`}
            >
              <span className="font-medium mr-2">{option.order})</span>
              {option.text}
              {option.isCorrect && <span className="text-green-600 text-sm ml-2">(Correta)</span>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
