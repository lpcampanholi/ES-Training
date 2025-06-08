import { Level } from "@/types/prisma"

export function getNextLevel(currentLevel: Level): Level {
  switch (currentLevel) {
    case "fundamental":
      return "essencial"
    case "essencial":
      return "avancado"
    default:
      return currentLevel
  }
}


export function getLevelName(level: Level): string {
  switch (level) {
    case "fundamental":
      return "Fundamental"
    case "essencial":
      return "Essencial"
    case "avancado":
      return "Avançado"
    default:
      return level
  }
}

export function getLevelColor(level: Level): string {
  switch (level) {
    case "fundamental":
      return "bg-green-100 text-green-800"
    case "essencial":
      return "bg-blue-100 text-blue-800"
    case "avancado":
      return "bg-amber-100 text-amber-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function getLevelDescription(level: Level): string {
  switch (level) {
    case "fundamental":
      return "Neste nível, você aprenderá os conceitos básicos e fundamentos essenciais para iniciar sua jornada."
    case "essencial":
      return "Neste nível, você aprofundará seus conhecimentos e aprenderá técnicas mais avançadas."
    case "avancado":
      return "Neste nível, você dominará técnicas avançadas e resolverá problemas complexos."
    default:
      return "Aprenda mais sobre este nível na Formação SmartES."
  }
}
