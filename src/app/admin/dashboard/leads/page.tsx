"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { ColumnDef } from "@tanstack/react-table"

type Lead = {
  id: string
  name: string
  email: string
  phone: string | null
  createdAt: string
  updatedAt: string
}

export default function LeadsPage() {
  const { toast } = useToast()
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("/api/leads")
        if (!response.ok) {
          throw new Error("Erro ao buscar leads")
        }
        const data = await response.json()
        setLeads(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os leads",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeads()
  }, [toast])

  const handleExportCSV = () => {
    if (leads.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há leads para exportar",
        variant: "destructive",
      })
      return
    }

    // Criar cabeçalho CSV
    const headers = ["Nome", "Email", "Telefone", "Data de Cadastro"]

    // Criar linhas de dados
    const rows = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone || "",
      format(new Date(lead.createdAt), "dd/MM/yyyy HH:mm"),
    ])

    // Combinar cabeçalho e linhas
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `leads_${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Exportação concluída",
      description: "Os leads foram exportados com sucesso",
    })
  }

  const viewLeadDetails = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDialogOpen(true)
  }

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Telefone",
      cell: ({ row }) => row.original.phone || "-",
    },
    {
      accessorKey: "createdAt",
      header: "Data de Cadastro",
      cell: ({ row }) => format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => viewLeadDetails(row.original)}>
          <Eye className="h-4 w-4" />
          <span className="sr-only">Ver detalhes</span>
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Card>
        <div className="flex justify-between  items-center mx-6 mb-6 mt-4">
          <CardTitle>Lista de Leads</CardTitle>
          <Button onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">Carregando...</div>
          ) : (
            <DataTable columns={columns} data={leads} searchColumn="name" searchPlaceholder="Buscar por nome..." />
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500">Nome</h3>
                <p className="text-lg">{selectedLead.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Email</h3>
                <p className="text-lg">{selectedLead.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Telefone</h3>
                <p className="text-lg">{selectedLead.phone || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Data de Cadastro</h3>
                <p className="text-lg">
                  {format(new Date(selectedLead.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <div className="pt-2">
                <Badge>Lead</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
