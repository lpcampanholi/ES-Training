import { DashboardStats } from "@/types"

export class DashboardService {
  static async getStats(): Promise<DashboardStats> {
    const response = await fetch("/api/dashboard/stats")
    if (!response.ok) {
      throw new Error("Erro ao buscar estatísticas")
    }

    return response.json()
  }
}
