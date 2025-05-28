"use client"

import { useState, useEffect } from "react"
import { SubjectService } from "@/services"
import type { SubjectUI } from "@/types"

export function useSubjects() {
  const [subjects, setSubjects] = useState<SubjectUI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // Aqui estamos usando o método que retorna os subjects com informações de UI
        const data = SubjectService.getSubjectsUI()
        setSubjects(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar disciplinas")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  return { subjects, isLoading, error }
}
