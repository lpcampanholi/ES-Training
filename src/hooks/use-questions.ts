"use client"

import { useState, useEffect } from "react"
import { QuestionService } from "@/services"
import { Question, QuestionFilters } from "@/types"

export function useQuestions(filters?: QuestionFilters) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await QuestionService.getQuestions(filters)
      setQuestions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar questões")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [filters])

  return { questions, isLoading, error, refetch: () => fetchQuestions() }
}
