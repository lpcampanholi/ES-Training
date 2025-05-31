"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import type { ColumnDef } from "@tanstack/react-table"
import { Loader2 } from "lucide-react"

type User = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users")
        if (!response.ok) {
          throw new Error("Erro ao buscar usuários")
        }
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        toast("Erro", {
          description: "Não foi possível carregar os usuários",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [toast])

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => row.original.name || "-",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Função",
      cell: ({ row }) => (
        <Badge variant={row.original.role === "ADMIN" ? "default" : "outline"}>
          {row.original.role === "ADMIN" ? "Administrador" : "Usuário"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Data de Cadastro",
      cell: ({ row }) => format(new Date(row.original.createdAt), "dd/MM/yyyy", { locale: ptBR }),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Usuários</h1>
      </div>
      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <DataTable columns={columns} data={users} searchColumn="email" searchPlaceholder="Buscar por email..." />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
