"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle,
  FileSpreadsheet,
  Database,
  BarChart3,
  Code,
  TrendingUp,
  Brain,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Excel Solutions" width={110} height={20} className="h-10 w-auto" />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#formacao" className="text-slate-700 hover:text-green-600 transition-colors">
              A Formação
            </Link>
            <Link href="#modulos" className="text-slate-700 hover:text-green-600 transition-colors">
              Módulos
            </Link>
            <Link href="#vantagens" className="text-slate-700 hover:text-green-600 transition-colors">
              Vantagens
            </Link>
          </nav>
          <div>
            <Link href="/disciplinas">
              <Button className="bg-green-600 hover:bg-green-700">Começar minha jornada</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-orange-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">Formação SmartES</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                A Formação Inteligente em Análise de Dados da Excel Solutions
              </h1>
              <p className="text-xl text-slate-600 mb-8 font-semibold">
                Transforme dados em informações úteis que fazem a diferença!
              </p>
              <p className="text-slate-600 mb-8">
                Desenvolvida para capacitar profissionais que desejam aprimorar suas habilidades, a Formação SmartES
                oferece uma jornada prática de aprendizagem, do básico ao avançado, nas principais ferramentas para
                análise de dados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/disciplinas">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Quero começar minha jornada
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#modulos">
                  <Button size="lg" variant="outline">
                    Conhecer os módulos
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-10 left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <Image
                    src="/data-analysis.jpeg"
                    alt="Análise de dados"
                    className="rounded-lg"
                    width={500}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Aulas 100% Ao Vivo Online</h3>
                <p className="text-slate-600">Pelo Microsoft Teams, com interação direta com os instrutores</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Estudo de casos reais</h3>
                <p className="text-slate-600">Chega de &quot;aprendi, mas não consigo aplicar&quot;</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Certificação Analista de Dados</h3>
                <p className="text-slate-600">Reconhecido pelo MEC + selo Excel Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="formacao" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">A Formação SmartES</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Seja você iniciante ou com alguma experiência, esta é a oportunidade ideal para impulsionar sua carreira
              com um conteúdo completo, direto ao ponto e com acompanhamento de especialistas.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <p className="text-center text-slate-700 mb-8">
              Todos os cursos foram criados e desenvolvidos para oferecer um aprendizado prático e de aplicação
              imediata.
            </p>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modulos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Módulos da Formação</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Uma jornada completa para transformar você em um analista de dados de excelência
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">EXCEL</h3>
                <h4 className="text-lg font-semibold mb-4 text-center text-green-600">Análise</h4>
                <p className="text-slate-600">
                  Inicie sua jornada dominando o Excel, a ferramenta fundamental para todo analista de dados. Crie
                  planilhas avançadas, automação de tarefas básicas e análise de dados para otimizar processos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Code className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">PYTHON</h3>
                <h4 className="text-lg font-semibold mb-4 text-center text-blue-600">Manipulação</h4>
                <p className="text-slate-600">
                  Avance para o Python, a linguagem de programação mais poderosa para análise de dados. Você aprenderá
                  como automatizar processos e a manipular grandes volumes de dados com flexibilidade e eficiência.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Database className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">SQL</h3>
                <h4 className="text-lg font-semibold mb-4 text-center text-amber-600">Captação</h4>
                <p className="text-slate-600">
                  Mergulhe no SQL, aprendendo a extrair, manipular e otimizar consultas em bancos de dados relacionais,
                  tornando a análise de informações mais ágil.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">POWER BI</h3>
                <h4 className="text-lg font-semibold mb-4 text-center text-purple-600">Apresentação</h4>
                <p className="text-slate-600">
                  Transforme dados em visualizações interativas e crie dashboards dinâmicos, transformando dados em
                  informações visuais que facilitam a tomada de decisões.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/disciplinas">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Quero começar minha jornada
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section id="vantagens" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Por que fazer a Formação?</h2>
              <p className="text-lg text-slate-600 mb-6">
                Empresas de todos os setores buscam por profissionais capazes de transformar dados em insights
                estratégicos.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span>Otimizar processos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span>Melhorar a tomada de decisões</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span>Gerar vantagem competitiva no mercado</span>
                </li>
              </ul>
              <p className="text-slate-700 font-medium">
                A Formação SmartES atende a essa crescente demanda por Analistas de dados, oferecendo um treinamento
                completo, prático e atualizado.
              </p>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Habilidades desenvolvidas</h2>
              <p className="text-lg text-slate-600 mb-6">
                Ao longo do treinamento, o aluno desenvolve habilidades essenciais para se tornar versátil, preparado
                para enfrentar os desafios do mundo corporativo e para gerar soluções que impactem diretamente nos
                resultados das organizações.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2 flex items-center">
                    <Brain className="h-5 w-5 text-green-600 mr-2" />
                    Hard Skills
                  </h3>
                  <p className="text-sm text-slate-600">
                    Conhecimento para realizar análises estatísticas, criar modelos preditivos e interpretar grandes
                    volumes de dados.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2 flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                    Soft Skills
                  </h3>
                  <p className="text-sm text-slate-600">
                    Aplicação do raciocínio lógico e estruturado na identificação de problemas, encontrando soluções
                    inovadoras e práticas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="empresas" className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/logo-clara.png"
                alt="Excel Solutions"
                width={180}
                height={50}
                className="h-10 w-auto mb-4"
              />
              <p className="mb-4">
                Formação inteligente em análise de dados para transformar sua carreira e sua empresa.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Módulos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#modulos" className="hover:text-white transition-colors">
                    Excel
                  </Link>
                </li>
                <li>
                  <Link href="#modulos" className="hover:text-white transition-colors">
                    Python
                  </Link>
                </li>
                <li>
                  <Link href="#modulos" className="hover:text-white transition-colors">
                    SQL
                  </Link>
                </li>
                <li>
                  <Link href="#modulos" className="hover:text-white transition-colors">
                    Power BI
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#formacao" className="hover:text-white transition-colors">
                    A Formação
                  </Link>
                </li>
                <li>
                  <Link href="#modulos" className="hover:text-white transition-colors">
                    Módulos
                  </Link>
                </li>
                <li>
                  <Link href="#vantagens" className="hover:text-white transition-colors">
                    Vantagens
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Contato</h4>
              <p className="mb-2">contato@excelsolutions.com</p>
              <p>(11) 99999-9999</p>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Excel Solutions. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
