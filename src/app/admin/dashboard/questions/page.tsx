"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import QuestionForm from "@/components/question-form"
import QuestionItem from "@/components/question-item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string>("excel")
  const [selectedLevel, setSelectedLevel] = useState<string>("fundamental")

  useEffect(() => {
    fetchQuestions()
  }, [selectedSubject, selectedLevel])

  const fetchQuestions = async () => {
    try {
      setIsLoading(true)
      let url = "/api/questions"
      const params = new URLSearchParams()

      if (selectedSubject !== "all") {
        params.append("subject", selectedSubject)
      }

      if (selectedLevel !== "all") {
        params.append("level", selectedLevel)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Erro ao buscar questões")
      }
      const data = await response.json()
      setQuestions(data)
    } catch (error) {
      toast("Erro", {
        description: "Não foi possível carregar as questões",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddQuestion = async (questionData: any) => {
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      })

      if (!response.ok) {
        toast("Erro", {
          description: "Não foi possível adicionar a questão",
        })
        throw new Error("Erro ao adicionar questão")
      }

      const newQuestion = await response.json()
      setQuestions((prev) => [newQuestion, ...prev])
      toast("Questão adicionada com sucesso!")
      setIsDialogOpen(false)
    } catch (error) {
      toast("Erro", {
        description: "Não foi possível adicionar a questão",
      })
    }
  }

  const handleUpdateQuestion = async (
    questionId: string,
    questionData: any
  ) => {
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar questão")
      }

      const updatedQuestion = await response.json()
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? updatedQuestion : q))
      )

      toast("Questão atualizada com sucesso!")
      setIsDialogOpen(false)
    } catch (error) {
      toast("Erro", {
        description: "Não foi possível atualizar a questão",
      })
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta questão?")) {
      return
    }

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir questão")
      }

      setQuestions((prev) => prev.filter((q) => q.id !== questionId))

      toast("Questão excluída com sucesso!")
    } catch (error) {
      toast("Erro", {
        description: "Não foi possível excluir a questão",
      })
    }
  }

  return (
    <div>
      {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Questões</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Questão
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[70%] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nova Questão</DialogTitle>
                </DialogHeader>
                  <QuestionForm onSubmit={handleAddQuestion} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6 flex flex-wrap gap-4">
            <div className="w-full md:w-64">
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as disciplinas</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="powerbi">Power BI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="fundamental">Fundamental</SelectItem>
                  <SelectItem value="essencial">Essencial</SelectItem>
                  <SelectItem value="avancado">Avançado</SelectItem>
                  <SelectItem value="profissional">Profissional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {questions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-10">
                <p className="text-slate-500 mb-4">
                  Nenhuma questão encontrada
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Questão
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  index={index}
                  onDelete={() => handleDeleteQuestion(question.id)}
                  onUpdate={handleUpdateQuestion}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
