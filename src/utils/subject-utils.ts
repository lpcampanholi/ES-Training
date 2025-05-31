import { Subject } from "@/types/prisma"

export function getSubjectName(subject: Subject): string {
  switch (subject) {
    case "excel":
      return "Excel"
    case "sql":
      return "SQL"
    case "python":
      return "Python"
    case "powerbi":
      return "Power BI"
    default:
      return subject
  }
}

export function getSubjectColor(subject: Subject): string {
  switch (subject) {
    case "excel":
      return "bg-green-100 text-green-800"
    case "sql":
      return "bg-amber-100 text-amber-800"
    case "python":
      return "bg-blue-100 text-blue-800"
    case "powerbi":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
