import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, BarChart3, Database, Code } from "lucide-react"

const getIcon = (subjectSlug: string) => {
  const icons: Record<string, any> = {
    excel: FileSpreadsheet,
    powerbi: BarChart3,
    sql: Database,
    python: Code,
  }

  const Icon = icons[subjectSlug] || FileSpreadsheet
  return <Icon className="h-5 w-5" />
}

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    INICIANTE: "bg-green-100 text-green-800",
    INTERMEDIARIO: "bg-blue-100 text-blue-800",
    AVANCADO: "bg-purple-100 text-purple-800",
    EXPERT: "bg-amber-100 text-amber-800",
  }

  return colors[level] || "bg-gray-100 text-gray-800"
}

const getLevelName = (level: string) => {
  const names: Record<string, string> = {
    INICIANTE: "Iniciante",
    INTERMEDIARIO: "Intermediário",
    AVANCADO: "Avançado",
    EXPERT: "Expert",
  }

  return names[level] || level
}

export default function TestList({ subjects }: { subjects: any[] }) {
  // Flatten all tests from all subjects
  const allTests = subjects.flatMap((subject) =>
    subject.tests.map((test: any) => ({
      ...test,
      subject: {
        id: subject.id,
        name: subject.name,
        slug: subject.slug,
        color: subject.color,
      },
    })),
  )

  if (allTests.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">Nenhum teste encontrado</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allTests.map((test) => (
        <Link key={test.id} href={`/admin/dashboard/tests/${test.id}`}>
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${test.subject.color || "bg-blue-100 text-blue-600"}`}>
                  {getIcon(test.subject.slug)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{test.title}</h3>
                  <p className="text-sm text-slate-500">{test.subject.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge className={`${getLevelColor(test.level)}`}>{getLevelName(test.level)}</Badge>
                <Badge variant={test.isActive ? "default" : "outline"}>{test.isActive ? "Ativo" : "Inativo"}</Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
