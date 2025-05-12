// Buscar teste por ID
export async function getTestById(testId: string) {
  const response = await fetch(`/api/tests/${testId}`)
  if (!response.ok) {
    throw new Error("Erro ao buscar teste")
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
