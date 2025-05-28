import type { Lead, CreateLeadDTO } from "@/types"

export class LeadService {
  static async getLeads(): Promise<Lead[]> {
    const response = await fetch("/api/leads")
    if (!response.ok) {
      throw new Error("Erro ao buscar leads")
    }

    return response.json()
  }

  static async createLead(data: CreateLeadDTO): Promise<Lead> {
    const response = await fetch("/api/leads", {
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
}
