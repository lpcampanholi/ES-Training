import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, BookOpen } from "lucide-react"
import prisma from "@/lib/prisma"
import TestList from "@/components/test-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const subjects = await prisma.subject.findMany({
    include: {
      tests: true,
    },
  })

  const totalTests = await prisma.test.count()
  const totalQuestions = await prisma.question.count()
  const totalLeads = await prisma.lead.count()
  const totalUsers = await prisma.user.count()

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de testes</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de questões</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de leads</CardTitle>
            <Users className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de usuários</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Todos os testes</h2>
        <Link href="/admin/dashboard/tests/new">
          <Button>Adicionar Teste</Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          {subjects.map((subject) => (
            <TabsTrigger key={subject.id} value={subject.id}>
              {subject.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <TestList subjects={subjects} />
        </TabsContent>
        {subjects.map((subject) => (
          <TabsContent key={subject.id} value={subject.id}>
            <TestList subjects={[subject]} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
