"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import QuestionForm from "@/components/question-form"
import parse from "html-react-parser"
import { Badge } from "@/components/ui/badge"
import { getLevelColor, getSubjectColor, getValueColor, getValueText } from "@/utils"
import { QuestionFormData, FrontendQuestion } from "@/types"
import { useState } from "react"

interface QuestionItemProps {
  question: FrontendQuestion
  index: number
  onDelete: () => void
  onUpdate: (questionId: string, data: QuestionFormData) => void,
}

export default function QuestionItem({
  question,
  index,
  onDelete,
  onUpdate,
}: QuestionItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const handleUpdate = (data: QuestionFormData): void => {
    onUpdate(question.id, data)
    setIsEditOpen(false)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4 mt-1">
            <h3 className="font-semibold text-lg">Questão {index + 1}</h3>
            <div className="flex gap-2">
              <Badge className={`${getSubjectColor(question.subject)} text-sm font-medium px-3 rounded-full border-1 border-slate-200`} variant="outline">{question.subject}</Badge>
              <Badge className={getLevelColor(question.level)}>{question.level}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
             <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Pencil className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[70%] h-[90vh] p-6">
                <div className="flex flex-col h-full overflow-y-auto pb-8 pr-8 m-4">
                  <DialogHeader className="shrink-0 pb-4">
                    <DialogTitle>Editar Questão</DialogTitle>
                  </DialogHeader>
                  <QuestionForm
                    initialData={question}
                    onSubmit={handleUpdate}
                    isEditing
                    onCancel={() => setIsEditOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-1" />
              Excluir
            </Button>
          </div>
        </div>
        <div className="mb-4">
          <div className="rich-text-content">{parse(question.text)}</div>
        </div>
        <div className="space-y-2">
          {question.options.map((option, idx) => (
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
