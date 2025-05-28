import type React from "react"
// Enums
export enum Subject {
  excel = "excel",
  sql = "sql",
  python = "python",
  powerbi = "powerbi",
}

export enum Level {
  fundamental = "fundamental",
  essencial = "essencial",
  avancado = "avancado",
  profissional = "profissional",
}

export enum Role {
  SELLER = "SELLER",
  MASTER = "MASTER",
  ADMIN = "ADMIN",
}

export enum LeadStage {
  PENDENTE = "PENDENTE",
  CONTRATADO = "CONTRATADO",
  CONVERTIDO = "CONVERTIDO",
}

// Tipos básicos
export interface User {
  id: string
  name: string | null
  email: string
  password?: string
  image: string | null
  role: Role
  createdAt: Date
  updatedAt: Date
}

export interface Question {
  id: string
  text: string
  subject: Subject
  level: Level
  options: Option[]
  createdAt: Date
  updatedAt: Date
}

export interface Option {
  id: string
  text: string
  value: number // 0.0, 4.0, 7.0, 10.0
  questionId: string
  question?: Question
  createdAt: Date
  updatedAt: Date
}

export interface UserTest {
  id: string
  userId: string
  score: number | null
  answers: Record<string, string> // JSON object {questionId: optionId}
  questions: string[] // JSON array of question IDs
  subject: Subject
  level: Level
  startedAt: Date
  finishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  testLevel: Level | null
  testSubject: Subject | null
  fromTest: boolean
  stage: LeadStage
  observations: string | null
  createdAt: Date
  updatedAt: Date
}

// DTOs para API
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
  subject: Subject
  initialLevel?: Level
  userId: string
}

export interface SubmitAnswersDTO {
  testId: string
  answers: Record<string, string>
  isComplete?: boolean
}

// Responses da API
export interface GenerateTestResponse {
  testId: string
  questions: Question[]
  currentLevel: Level
}

export interface SubmitAnswersResponse {
  testId: string
  isComplete: boolean
  score?: number
  recommendedLevel?: Level
  currentLevel?: Level
  passedLevel?: boolean
  questions?: Question[]
  previousLevel?: Level
  message?: string
  currentAverage?: number
}

export interface TestResultResponse {
  testId: string
  questions: Question[]
  currentLevel: Level
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Tipos para componentes
export interface QuestionFormData {
  text: string
  subject: Subject
  level: Level
  options: CreateOptionDTO[]
}

export interface TestFormData {
  nome: string
  email: string
  telefone: string
}

export interface AdminTestFormData {
  nome: string
  email: string
  subject: Subject
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

// Tipos para tabelas
export interface LeadTableData {
  id: string
  name: string
  email: string
  phone: string | null
  testLevel: Level | null
  testSubject: Subject | null
  fromTest: boolean
  stage: LeadStage
  observations: string | null
  createdAt: string
}

export interface UserTableData {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
}

// Tipos para estatísticas
export interface DashboardStats {
  totalTests: number
  totalQuestions: number
  totalLeads: number
  totalUsers: number
}

// Tipos para filtros
export interface QuestionFilters {
  subject?: Subject
  level?: Level
}

export interface TestFilters {
  subjectId?: string
  level?: Level
}

export interface LeadFilters {
  stage?: LeadStage
  testSubject?: Subject
  fromTest?: boolean
}

// Tipos para hooks
export interface UseToastProps {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

// Tipos para autenticação
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

// Tipos para resultados
export interface TestResult {
  score: number
  recommendedLevel: Level
  currentLevel: Level
  passedLevel: boolean
  message?: string
}

// Tipos para navegação
export interface LevelInfo {
  id: Level
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
}

// Tipos para formulários
export interface FormErrors {
  [key: string]: string
}

export interface FormState<T> {
  data: T
  errors: FormErrors
  isSubmitting: boolean
}

// Tipo para o Subject com informações de UI
export interface SubjectUI {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
}

// Tipo para o modal de celebração
export interface CelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  previousLevel: Level
  nextLevel: Level
  message?: string
}

// Tipo para as instruções do teste
export interface TestInstructionsProps {
  subject: Subject
  onStart: () => void
}

// Tipos específicos para o teste
export interface TestData {
  testId: string
  questions: Question[]
  currentLevel: Level
}
