import type { Subject, SubjectUI } from "@/types"
import { FileSpreadsheet, Database, Code, BarChart3 } from "lucide-react"

export class SubjectService {
  static async getSubjects(): Promise<Subject[]> {
    const response = await fetch("/api/subjects")
    if (!response.ok) {
      throw new Error("Erro ao buscar disciplinas")
    }

    return response.json()
  }

  static getSubjectById(id: string): Promise<Subject> {
    return fetch(`/api/subjects/${id}`).then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar disciplina")
      return res.json()
    })
  }

  // Método para obter os subjects com informações de UI
  static getSubjectsUI(): SubjectUI[] {
    return [
      {
        id: "excel",
        name: "Excel",
        icon: FileSpreadsheet,
        color: "green-600",
        description: "Análise",
      },
      {
        id: "python",
        name: "Python",
        icon: Code,
        color: "blue-600",
        description: "Manipulação",
      },
      {
        id: "sql",
        name: "SQL",
        icon: Database,
        color: "amber-600",
        description: "Captação",
      },
      {
        id: "powerbi",
        name: "Power BI",
        icon: BarChart3,
        color: "purple-600",
        description: "Apresentação",
      },
    ]
  }

  // Método para obter um subject específico com informações de UI
  static getSubjectUIById(id: string): SubjectUI | undefined {
    return this.getSubjectsUI().find((subject) => subject.id === id)
  }

  // Método para converter um Subject para SubjectUI
  static toSubjectUI(subject: Subject): SubjectUI {
    const subjectUI = this.getSubjectUIById(subject.toString())
    if (!subjectUI) {
      // Fallback para caso não encontre
      return {
        id: subject.toString(),
        name: subject.toString().charAt(0).toUpperCase() + subject.toString().slice(1),
        icon: FileSpreadsheet,
        color: "blue-600",
        description: "Análise de dados",
      }
    }
    return subjectUI
  }
}
