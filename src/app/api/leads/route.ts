import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import type { CreateLeadDTO } from "@/types/dtos"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const stage = searchParams.get("stage")
    const testSubject = searchParams.get("testSubject")
    const fromTest = searchParams.get("fromTest")

    const where: any = {}

    if (stage) where.stage = stage
    if (testSubject) where.testSubject = testSubject
    if (fromTest !== null) where.fromTest = fromTest === "true"

    const leads = await prisma.lead.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json({ error: "Erro ao buscar leads" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateLeadDTO = await request.json()
    const { name, email, phone, testLevel, testSubject, fromTest, stage, observations } = body

    if (!name || !email) {
      return NextResponse.json({ error: "Nome e email são obrigatórios" }, { status: 400 })
    }

    // Verificar se o lead já existe
    const existingLead = await prisma.lead.findUnique({
      where: {
        email,
      },
    })

    if (existingLead) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        testLevel,
        testSubject,
        fromTest: fromTest || false,
        stage: stage || "PENDENTE",
        observations,
      },
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json({ error: "Erro ao criar lead" }, { status: 500 })
  }
}
