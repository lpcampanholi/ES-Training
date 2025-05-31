import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import type { Lead } from "@prisma/client"
import { UpdateLeadDTO } from "@/types/dtos"

interface RouteParams {
  params: { id: string }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<Lead | { error: string }>> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const lead = await prisma.lead.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 })
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Error fetching lead:", error)
    return NextResponse.json({ error: "Erro ao buscar lead" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<Lead | { error: string }>> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body: UpdateLeadDTO = await request.json()
    const { name, email, phone, testLevel, testSubject, fromTest, stage, observations } = body

    const lead = await prisma.lead.update({
      where: {
        id: params.id,
      },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(testLevel !== undefined && { testLevel }),
        ...(testSubject !== undefined && { testSubject }),
        ...(fromTest !== undefined && { fromTest }),
        ...(stage && { stage }),
        ...(observations !== undefined && { observations }),
      },
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Error updating lead:", error)
    return NextResponse.json({ error: "Erro ao atualizar lead" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    await prisma.lead.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting lead:", error)
    return NextResponse.json({ error: "Erro ao excluir lead" }, { status: 500 })
  }
}
