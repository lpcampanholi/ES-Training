import { SubjectUI } from "@/types"
import { FileSpreadsheet, Database, Code, BarChart3 } from "lucide-react"

export class SubjectService {

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

  static getSubjectUIById(id: string): SubjectUI | undefined {
    return this.getSubjectsUI().find((subject) => subject.id === id)
  }

}
