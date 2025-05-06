import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Award, BarChart3, Clock, Users, BookOpen, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">TestePro</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#beneficios" className="text-slate-700 hover:text-blue-600 transition-colors">
              Benefícios
            </Link>
            <Link href="#como-funciona" className="text-slate-700 hover:text-blue-600 transition-colors">
              Como Funciona
            </Link>
            <Link href="#depoimentos" className="text-slate-700 hover:text-blue-600 transition-colors">
              Depoimentos
            </Link>
          </nav>
          <div>
            <Link href="/nivel/excel">
              <Button className="bg-blue-600 hover:bg-blue-700">Iniciar Teste</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <Badge className="mb-4">Novo</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                Descubra seu nível de conhecimento em tecnologia
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Faça nossos testes online gratuitos e receba um feedback personalizado sobre suas habilidades em Excel,
                PowerBI, SQL e Python.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/nivel/excel">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Iniciar Agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#como-funciona">
                  <Button size="lg" variant="outline">
                    Saiba Mais
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Teste online"
                className="rounded-lg shadow-lg"
                width={500}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Benefícios dos Nossos Testes</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Descubra por que milhares de profissionais e estudantes escolhem nossa plataforma para avaliar seus
              conhecimentos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Rápido e Conveniente</h3>
                <p className="text-slate-600">
                  Complete os testes em apenas 20 minutos, de qualquer lugar e a qualquer momento.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Feedback Detalhado</h3>
                <p className="text-slate-600">
                  Receba uma análise completa das suas habilidades e áreas para desenvolvimento.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Avaliação Precisa</h3>
                <p className="text-slate-600">
                  Questões desenvolvidas por especialistas para medir com precisão seu nível de conhecimento.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Compare seu Desempenho</h3>
                <p className="text-slate-600">Veja como você se compara com outros profissionais da sua área.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Conteúdo Atualizado</h3>
                <p className="text-slate-600">
                  Testes constantemente atualizados com as últimas tendências e tecnologias.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Melhore suas Habilidades</h3>
                <p className="text-slate-600">
                  Identifique pontos fracos e receba recomendações personalizadas para melhorar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Como Funciona</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Nosso processo é simples e rápido. Em poucos minutos você terá uma avaliação completa das suas
              habilidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Escolha o Assunto</h3>
              <p className="text-slate-600">
                Selecione entre Excel, PowerBI, SQL ou Python para testar seus conhecimentos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Faça o Teste</h3>
              <p className="text-slate-600">Responda às questões dentro do tempo limite. São apenas 20 minutos!</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Receba seu Resultado</h3>
              <p className="text-slate-600">
                Veja sua pontuação e análise detalhada imediatamente após concluir o teste.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/nivel/excel">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">O Que Dizem Nossos Usuários</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Milhares de profissionais já utilizaram nossa plataforma para avaliar e melhorar suas habilidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">Carlos Mendes</h4>
                    <p className="text-sm text-slate-500">Analista de Dados</p>
                  </div>
                </div>
                <p className="text-slate-600">
                  "Os testes me ajudaram a identificar lacunas no meu conhecimento de SQL que eu nem sabia que tinha.
                  Agora estou muito mais confiante nas minhas habilidades."
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">Ana Paula</h4>
                    <p className="text-sm text-slate-500">Gerente de Projetos</p>
                  </div>
                </div>
                <p className="text-slate-600">
                  "Usei os testes de Excel para preparar minha equipe. A plataforma é intuitiva e os resultados nos
                  ajudaram a focar nosso treinamento nas áreas certas."
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">Roberto Silva</h4>
                    <p className="text-sm text-slate-500">Estudante de TI</p>
                  </div>
                </div>
                <p className="text-slate-600">
                  "Os testes de Python me ajudaram a me preparar para entrevistas de emprego. Consegui identificar meus
                  pontos fracos e melhorar antes das entrevistas."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para testar seus conhecimentos?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Faça nossos testes gratuitos agora mesmo e descubra seu verdadeiro nível de conhecimento em tecnologia.
          </p>
          <Link href="/nivel/excel">
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-slate-100">
              Iniciar Teste Gratuito
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">TestePro</h3>
              <p className="mb-4">
                Plataforma de testes online para avaliar e melhorar suas habilidades em tecnologia.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Testes</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/nivel/excel" className="hover:text-white transition-colors">
                    Excel
                  </Link>
                </li>
                <li>
                  <Link href="/nivel/powerbi" className="hover:text-white transition-colors">
                    PowerBI
                  </Link>
                </li>
                <li>
                  <Link href="/nivel/sql" className="hover:text-white transition-colors">
                    SQL
                  </Link>
                </li>
                <li>
                  <Link href="/nivel/python" className="hover:text-white transition-colors">
                    Python
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#beneficios" className="hover:text-white transition-colors">
                    Benefícios
                  </Link>
                </li>
                <li>
                  <Link href="#como-funciona" className="hover:text-white transition-colors">
                    Como Funciona
                  </Link>
                </li>
                <li>
                  <Link href="#depoimentos" className="hover:text-white transition-colors">
                    Depoimentos
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Contato</h4>
              <p className="mb-2">contato@testepro.com</p>
              <p>(11) 99999-9999</p>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} TestePro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
