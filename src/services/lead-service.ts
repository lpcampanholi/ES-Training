import type { Lead, CreateLeadDTO, UpdateLeadDTO, LeadFilters } from "@/types"

export class LeadService {
  private static readonly BASE_URL = "/api/leads"

  static async getLeads(filters?: LeadFilters): Promise<Lead[]> {
    const params = new URLSearchParams()

    if (filters?.stage) params.append("stage", filters.stage)
    if (filters?.testSubject) params.append("testSubject", filters.testSubject)
    if (filters?.fromTest !== undefined) params.append("fromTest", filters.fromTest.toString())

    const url = `${this.BASE_URL}${params.toString() ? `?${params.toString()}` : ""}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Erro ao buscar leads")
    }
    return response.json()
  }

  static async getLeadById(id: string): Promise<Lead> {
    const response = await fetch(`${this.BASE_URL}/${id}`)
    if (!response.ok) {
      throw new Error("Erro ao buscar lead")
    }
    return response.json()
  }

  static async createLead(data: CreateLeadDTO): Promise<Lead> {
    const response = await fetch(this.BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro ao criar lead")
    }

    return response.json()
  }

  static async updateLead(id: string, data: UpdateLeadDTO): Promise<Lead> {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro ao atualizar lead")
    }

    return response.json()
  }

  static async deleteLead(id: string): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro ao excluir lead")
    }
  }
}
