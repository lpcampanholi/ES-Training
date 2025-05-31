import { CreateOptionDTO } from "./dtos"
import { LeadStage, Level, Role, Subject } from "./prisma"

export interface QuestionFormData {
  text: string
  subject: Subject
  level: Level
  options: CreateOptionDTO[]
}

export interface LeadFormData {
  name: string
  email: string
  phone: string
  testLevel: Level | null
  testSubject: Subject | null
  fromTest: boolean
  stage: LeadStage
  observations: string
}

export interface QuestionFilters {
  subject?: Subject
  level?: Level
}

export interface LeadFilters {
  stage?: LeadStage
  testSubject?: Subject
  fromTest?: boolean
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: Role
  image?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SubjectUI {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
}

export interface FrontendOption {
  id: string
  text: string
  value: number
}

export interface FrontendQuestion {
  id: string
  text: string
  subject: Subject
  level: Level
  options: FrontendOption[]
}

export interface TestData {
  testId: string
  questions: FrontendQuestion[]
  currentLevel: Level
}