import { User } from "@/types/prisma"

export class UserService {
  static async getUsers(): Promise<User[]> {
    const response = await fetch("/api/users")
    if (!response.ok) {
      throw new Error("Erro ao buscar usuários")
    }

    return response.json()
  }

  static async getUserById(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
      throw new Error("Erro ao buscar usuário")
    }

    return response.json()
  }
}
