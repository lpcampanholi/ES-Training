"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import QuestionItem from "@/components/admin/question-item"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import QuestionForm from "@/components/admin/question-form"

export default function TestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [test, setTest] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch(`/api/tests/${params.id}`)

        if (!response.ok) {
          throw new Error("Erro ao buscar teste")
        }

        const data = await response.json()
        setTest(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar o teste",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTest()
  }, [params.id, toast])

  const handleDeleteTest = async () => {
    if (!confirm("Tem certeza que deseja excluir este teste?")) {
      return
    }

    try {
      const response = await fetch(`/api/tests/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir teste")
      }

      toast({
        title: "Teste excluído com sucesso!",
      })

      router.push("/admin/dashboard")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o teste",
        variant: "destructive",
      })
    }
  }

  const handleAddQuestion = async (questionData: any) => {
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...questionData,
          testId: params.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao adicionar questão")
      }

      const newQuestion = await response.json()

      setTest((prev: any) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }))

      setIsDialogOpen(false)

      toast({
        title: "Questão adicionada com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a questão",
        variant: "destructive",
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

      setTest((prev: any) => ({
        ...prev,
        questions: prev.questions.filter((q: any) => q.id !== questionId),
      }))

      toast({
        title: "Questão excluída com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a questão",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Carregando...</div>
  }

  if (!test) {
    return <div className="text-center py-10">Teste não encontrado</div>
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">{test.title}</h1>
        <div className="flex gap-2">
          <Link href={`/admin/tests/${params.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={handleDeleteTest}>
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Detalhes do Teste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Disciplina</p>
              <p>{test.subject.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Nível</p>
              <p>{test.level}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tempo Limite</p>
              <p>{Math.floor(test.timeLimit / 60)} minutos</p>
            </div>
          </div>
          {test.description && (
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Descrição</p>
              <p>{test.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Questões</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Questão
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Nova Questão</DialogTitle>
            </DialogHeader>
            <QuestionForm onSubmit={handleAddQuestion} />
          </DialogContent>
        </Dialog>
      </div>

      {test.questions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <p className="text-slate-500 mb-4">Nenhuma questão cadastrada</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Questão
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {test.questions.map((question: any, index: number) => (
            <QuestionItem
              key={question.id}
              question={question}
              index={index}
              onDelete={() => handleDeleteQuestion(question.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
