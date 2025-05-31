import { LeadStage, Level, Subject } from "./prisma"

export interface CreateQuestionDTO {
  text: string
  subject: Subject
  level: Level
  options: CreateOptionDTO[]
}

export interface CreateOptionDTO {
  text: string
  value: number
}

export interface UpdateQuestionDTO {
  text?: string
  subject?: Subject
  level?: Level
  options?: CreateOptionDTO[]
}

export interface GenerateTestDTO {
  leadEmail: string
  subject: Subject
  level: Level
}

export interface SubmitAnswersDTO {
  testId: string
  answers: Record<string, string>
  isComplete?: boolean
}

export interface CreateLeadDTO {
  name: string
  email: string
  phone?: string
  testLevel?: Level
  testSubject?: Subject
  fromTest?: boolean
  stage?: LeadStage
  observations?: string
}

export interface UpdateLeadDTO {
  name?: string
  email?: string
  phone?: string
  testLevel?: Level
  testSubject?: Subject
  fromTest?: boolean
  stage?: LeadStage
  observations?: string
}