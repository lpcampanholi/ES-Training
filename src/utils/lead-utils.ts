import { LeadStage } from "@/types"

export function getLeadStageName(stage: LeadStage): string {
  switch (stage) {
    case "PENDENTE":
      return "Pendente"
    case "CONTRATADO":
      return "Contratado"
    case "CONVERTIDO":
      return "Convertido"
    default:
      return stage
  }
}

export function getLeadStageColor(stage: LeadStage): string {
  switch (stage) {
    case "PENDENTE":
      return "bg-yellow-100 text-yellow-800"
    case "CONTRATADO":
      return "bg-blue-100 text-blue-800"
    case "CONVERTIDO":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
