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
  LineChart,
  MessageSquare,
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
            <Link href="#planos" className="text-slate-700 hover:text-green-600 transition-colors">
              Planos
            </Link>
          </nav>
          <div>
            <Link href="#matricula">
              <Button className="bg-green-600 hover:bg-green-700">Quero me matricular</Button>
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
                <p className="text-slate-600">Chega de "aprendi, mas não consigo aplicar"</p>
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
                    <LineChart className="h-5 w-5 text-green-600 mr-2" />
                    Hard Skills
                  </h3>
                  <p className="text-sm text-slate-600">
                    Habilidade no uso das ferramentas essenciais para análise e visualização de dados, aplicada de forma
                    eficaz em qualquer contexto.
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
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2 flex items-center">
                    <MessageSquare className="h-5 w-5 text-green-600 mr-2" />
                    Soft Skills
                  </h3>
                  <p className="text-sm text-slate-600">
                    Comunicação eficaz, adaptada a diferentes contextos. Gerencia o tempo para cumprir prazos e lidar
                    com múltiplas demandas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para fazer a diferença?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            A Formação SmartES oferece tudo o que você precisa para se tornar um analista de dados pronto para novas
            conquistas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-10">
            <div className="bg-green-700 bg-opacity-50 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Crescimento acelerado da carreira</h3>
            </div>
            <div className="bg-green-700 bg-opacity-50 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Aumento expressivo de salário</h3>
            </div>
            <div className="bg-green-700 bg-opacity-50 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Reconhecimento e valorização</h3>
            </div>
          </div>

          <p className="font-bold text-xl mb-8">A hora é agora! Vagas limitadas</p>

          <div className="bg-white text-green-800 p-4 rounded-lg inline-block mb-8">
            <p className="font-bold">
              Em média, quem conclui a Formação tem um aumento salarial de 16% nos primeiros 12 meses.
            </p>
          </div>

          <p className="text-xl mb-8">Qual é o preço de transformar sua carreira para sempre?</p>

          <Link href="/disciplinas">
            <Button size="lg" variant="outline" className="bg-white text-green-600 hover:bg-slate-100 border-white">
              Quero começar minha jornada
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Escolha sua trilha de aprendizado</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Cada módulo prepara você para o seguinte. Escolha fazer a Formação Completa com um super desconto de 20%
              ou comece sua jornada selecionando os primeiros módulos da Formação SmartES
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4">Profissional de Excel + Desenvolvedor Python</h3>
                    <p className="text-slate-600 mb-4">Duração: 6 meses</p>

                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        <FileSpreadsheet className="h-4 w-4 mr-1" />
                        EXCEL
                      </div>
                      <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        <Code className="h-4 w-4 mr-1" />
                        PYTHON
                      </div>
                      <div className="flex items-center bg-slate-100 text-slate-800 px-3 py-1 rounded-full opacity-50">
                        <Database className="h-4 w-4 mr-1" />
                        SQL
                      </div>
                      <div className="flex items-center bg-slate-100 text-slate-800 px-3 py-1 rounded-full opacity-50">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        POWER BI
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/2 text-center md:text-right">
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold">Investimento</h4>
                      <p className="text-slate-500 line-through">De R$ 420,00</p>
                      <p className="text-3xl font-bold text-green-600">
                        por R$ 378,00 <span className="text-lg font-normal">/ mês</span>
                      </p>
                      <p className="text-slate-600">ou à vista R$ 1.890,00</p>
                    </div>

                    <Link href="#matricula" id="matricula">
                      <Button size="lg" className="bg-green-600 hover:bg-green-700">
                        Quero me matricular
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <Link href="#empresas">
              <Button variant="outline" size="lg" className="uppercase">
                Veja também as vantagens de ter esse treinamento para sua equipe ou empresa
              </Button>
            </Link>
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
                  <Link href="#vantagens" className="hover:text-white transition-colors">
                    Vantagens
                  </Link>
                </li>
                <li>
                  <Link href="#planos" className="hover:text-white transition-colors">
                    Planos
                  </Link>
                </li>
                <li>
                  <Link href="#empresas" className="hover:text-white transition-colors">
                    Para Empresas
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
