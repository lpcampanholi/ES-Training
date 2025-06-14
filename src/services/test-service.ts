import { TestData } from "@/app/teste/[testId]/page"
import { GenerateTestDTO, SubmitAnswersDTO } from "@/types/dtos"
import { Level, Option, Question } from "@prisma/client"

export interface SubmitAnswersResponse {
  testId: string
  isComplete: boolean
  score?: number
  recommendedLevel?: Level
  currentLevel: Level
  previousLevel?: Level
  passedLevel?: boolean
  message?: string
  currentAverage?: number
  questions?: Array<
    Question & {
      options: Option[]
    }
  >
}

export class TestService {
  static async generateTest(data: GenerateTestDTO) {
    const response = await fetch("/api/generate-test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro ao gerar teste")
    }

    return response.json()
  }

  static async submitAnswers(data: SubmitAnswersDTO): Promise<SubmitAnswersResponse> {
    const response = await fetch("/api/submit-answers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro ao enviar respostas")
    }

    return response.json()
  }

  static async getTestById(id: string): Promise<TestData> {
    const response = await fetch(`/api/tests/${id}`)
    if (!response.ok) {
      throw new Error("Erro ao buscar teste")
    }

    return response.json()
  }
}
