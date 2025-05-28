import { AuthUser, LoginCredentials } from "@/types"

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erro ao fazer login")
    }

    return response.json()
  }

  static async logout(): Promise<void> {
    await fetch("/api/auth/signout", {
      method: "POST",
    })
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await fetch("/api/auth/session")
      if (!response.ok) {
        return null
      }
      return response.json()
    } catch {
      return null
    }
  }
}
