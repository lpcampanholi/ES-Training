"use client"

import { useState, useEffect } from "react"
import { LeadService } from "@/services/lead-service"
import type { Lead } from "@/types"

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeads = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await LeadService.getLeads()
      setLeads(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar leads")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  return { leads, isLoading, error, refetch: () => fetchLeads() }
}
