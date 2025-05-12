// Registrar um lead
export async function registerLead(data: { name: string; email: string; phone?: string }) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Erro ao registrar lead")
  }

  return response.json()
}
