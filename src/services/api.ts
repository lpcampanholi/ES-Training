// Serviço para comunicação com a API

// Buscar todos os assuntos
export async function getSubjects() {
  const response = await fetch("/api/subjects")
  if (!response.ok) {
    throw new Error("Erro ao buscar assuntos")
  }
  return response.json()
}

// Buscar testes por assunto
export async function getTestsBySubject(subjectId: string) {
  const response = await fetch(`/api/tests?subjectId=${subjectId}`)
  if (!response.ok) {
    throw new Error("Erro ao buscar testes")
  }
  return response.json()
}

// Buscar teste por ID
export async function getTestById(testId: string) {
  const response = await fetch(`/api/tests/${testId}`)
  if (!response.ok) {
    throw new Error("Erro ao buscar teste")
  }
  return response.json()
}

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

// Enviar respostas do teste
export async function submitTest(data: {
  userId: string
  testId: string
  answers: Array<{ questionId: string; optionId: string }>
}) {
  const response = await fetch("/api/user-tests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Erro ao enviar teste")
  }

  return response.json()
}
