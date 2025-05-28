"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Eye, Download, Edit, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { LeadForm } from "@/components/lead-form"
import { LeadService } from "@/services/lead-service"
import { getLevelName, getLevelColor, getSubjectName, getLeadStageName, getLeadStageColor } from "@/utils"
import type { Lead, LeadFormData } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create">("view")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async (): Promise<void> => {
    try {
      const data = await LeadService.getLeads()
      setLeads(data)
    } catch (error) {
      toast("Erro", {
        description: error instanceof Error ? error.message : "Não foi possível carregar os leads",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportCSV = (): void => {
    if (leads.length === 0) {
      toast("Nenhum dado para exportar", {
        description: "Não há leads para exportar",
      })
      return
    }

    // Criar cabeçalho CSV
    const headers = [
      "Nome",
      "Email",
      "Telefone",
      "Disciplina",
      "Nível",
      "Veio do Teste",
      "Etapa",
      "Observações",
      "Data de Cadastro",
    ]

    // Criar linhas de dados
    const rows = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone || "",
      lead.testSubject ? getSubjectName(lead.testSubject) : "",
      lead.testLevel ? getLevelName(lead.testLevel) : "",
      lead.fromTest ? "Sim" : "Não",
      getLeadStageName(lead.stage),
      lead.observations || "",
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

  const openDialog = (mode: "view" | "edit" | "create", lead?: Lead): void => {
    setDialogMode(mode)
    setSelectedLead(lead || null)
    setIsDialogOpen(true)
  }

  const closeDialog = (): void => {
    setIsDialogOpen(false)
    setSelectedLead(null)
    setDialogMode("view")
  }

  const handleSubmitLead = async (data: LeadFormData): Promise<void> => {
    setIsSubmitting(true)
    try {
      if (dialogMode === "create") {
        await LeadService.createLead(data)
        toast({
          title: "Sucesso",
          description: "Lead criado com sucesso",
        })
      } else if (dialogMode === "edit" && selectedLead) {
        await LeadService.updateLead(selectedLead.id, data)
        toast({
          title: "Sucesso",
          description: "Lead atualizado com sucesso",
        })
      }
      await fetchLeads()
      closeDialog()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar lead",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteLead = async (leadId: string): Promise<void> => {
    if (!confirm("Tem certeza que deseja excluir este lead?")) {
      return
    }

    try {
      await LeadService.deleteLead(leadId)
      toast({
        title: "Sucesso",
        description: "Lead excluído com sucesso",
      })
      await fetchLeads()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir lead",
        variant: "destructive",
      })
    }
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
      accessorKey: "testSubject",
      header: "Disciplina",
      cell: ({ row }) => {
        const subject = row.original.testSubject
        return subject ? <Badge variant="outline">{getSubjectName(subject)}</Badge> : "-"
      },
    },
    {
      accessorKey: "testLevel",
      header: "Nível",
      cell: ({ row }) => {
        const level = row.original.testLevel
        return level ? <Badge className={getLevelColor(level)}>{getLevelName(level)}</Badge> : "-"
      },
    },
    {
      accessorKey: "stage",
      header: "Etapa",
      cell: ({ row }) => (
        <Badge className={getLeadStageColor(row.original.stage)}>{getLeadStageName(row.original.stage)}</Badge>
      ),
    },
    {
      accessorKey: "fromTest",
      header: "Do Teste",
      cell: ({ row }) => (
        <Badge variant={row.original.fromTest ? "default" : "outline"}>{row.original.fromTest ? "Sim" : "Não"}</Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Data de Cadastro",
      cell: ({ row }) => format(new Date(row.original.createdAt), "dd/MM/yyyy", { locale: ptBR }),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => openDialog("view", row.original)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openDialog("edit", row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteLead(row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Leads</h1>
        <div className="flex gap-2">
          <Button onClick={() => openDialog("create")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">Carregando...</div>
          ) : (
            <DataTable columns={columns} data={leads} searchColumn="name" searchPlaceholder="Buscar por nome..." />
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" && "Novo Lead"}
              {dialogMode === "edit" && "Editar Lead"}
              {dialogMode === "view" && "Detalhes do Lead"}
            </DialogTitle>
          </DialogHeader>

          {dialogMode === "view" && selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Nome</h3>
                  <p className="text-lg">{selectedLead.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Email</h3>
                  <p className="text-lg">{selectedLead.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Telefone</h3>
                  <p className="text-lg">{selectedLead.phone || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Etapa</h3>
                  <Badge className={getLeadStageColor(selectedLead.stage)}>
                    {getLeadStageName(selectedLead.stage)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Disciplina do Teste</h3>
                  <p className="text-lg">{selectedLead.testSubject ? getSubjectName(selectedLead.testSubject) : "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Nível do Teste</h3>
                  <p className="text-lg">{selectedLead.testLevel ? getLevelName(selectedLead.testLevel) : "-"}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500">Veio do Teste de Nivelamento</h3>
                <Badge variant={selectedLead.fromTest ? "default" : "outline"}>
                  {selectedLead.fromTest ? "Sim" : "Não"}
                </Badge>
              </div>

              {selectedLead.observations && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Observações</h3>
                  <p className="text-lg">{selectedLead.observations}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-slate-500">Data de Cadastro</h3>
                <p className="text-lg">
                  {format(new Date(selectedLead.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => openDialog("edit", selectedLead)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" onClick={closeDialog}>
                  Fechar
                </Button>
              </div>
            </div>
          )}

          {(dialogMode === "create" || dialogMode === "edit") && (
            <LeadForm
              lead={selectedLead || undefined}
              onSubmit={handleSubmitLead}
              onCancel={closeDialog}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
