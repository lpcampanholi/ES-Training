import { QuestionFilters } from "@/types"
import { CreateQuestionDTO, UpdateQuestionDTO } from "@/types/dtos"
import { Question } from "@/types/prisma"

export class QuestionService {
  static async getQuestions(filters?: QuestionFilters): Promise<Question[]> {
    let url = "/api/questions"
    const params = new URLSearchParams()

    if (filters?.subject) {
      params.append("subject", filters.subject)
    }

    if (filters?.level) {
      params.append("level", filters.level)
    }

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Erro ao buscar questões")
    }

    return response.json()
  }

  static async getQuestionById(id: string): Promise<Question> {
    const response = await fetch(`/api/questions/${id}`)
    if (!response.ok) {
      throw new Error("Erro ao buscar questão")
    }

    return response.json()
  }

  static async createQuestion(data: CreateQuestionDTO): Promise<Question> {
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro ao criar questão")
    }

    return response.json()
  }

  static async updateQuestion(id: string, data: UpdateQuestionDTO): Promise<Question> {
    const response = await fetch(`/api/questions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro ao atualizar questão")
    }

    return response.json()
  }

  static async deleteQuestion(id: string): Promise<void> {
    const response = await fetch(`/api/questions/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro ao excluir questão")
    }
  }
}
