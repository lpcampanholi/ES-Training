import {
  GenerateTestDTO,
  GenerateTestResponse,
  SubmitAnswersDTO,
  SubmitAnswersResponse,
  TestResultResponse,
  UserTest,
} from "@/types"

export class TestService {
  static async generateTest(data: GenerateTestDTO): Promise<GenerateTestResponse> {
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

  static async getTestById(id: string): Promise<TestResultResponse> {
    const response = await fetch(`/api/tests/${id}`)
    if (!response.ok) {
      throw new Error("Erro ao buscar teste")
    }

    return response.json()
  }

  static async getUserTests(userId?: string): Promise<UserTest[]> {
    let url = "/api/user-tests"
    if (userId) {
      url += `?userId=${userId}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Erro ao buscar testes do usuário")
    }

    return response.json()
  }
}
