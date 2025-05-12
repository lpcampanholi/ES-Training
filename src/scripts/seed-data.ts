import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

// Função para gerar conteúdo HTML de exemplo para questões
function generateRichTextQuestion(index: number, subject: string) {
  const richTextTemplates = [
    `<h3>Análise o problema abaixo:</h3>
    <p>Considere uma planilha de ${subject} com os seguintes dados:</p>
    <table>
      <thead>
        <tr>
          <th>Produto</th>
          <th>Quantidade</th>
          <th>Preço</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Produto A</td>
          <td>10</td>
          <td>R$ 25,00</td>
          <td>R$ 250,00</td>
        </tr>
        <tr>
          <td>Produto B</td>
          <td>5</td>
          <td>R$ 30,00</td>
          <td>R$ 150,00</td>
        </tr>
        <tr>
          <td>Produto C</td>
          <td>8</td>
          <td>R$ 15,00</td>
          <td>R$ 120,00</td>
        </tr>
      </tbody>
    </table>
    <p>Qual é a fórmula correta para calcular o total de vendas?</p>`,

    `<h3>Observe a imagem abaixo:</h3>
    <p>A imagem mostra um gráfico de desempenho de vendas ao longo do tempo.</p>
    <img src="/placeholder.svg?height=200&width=400" alt="Gráfico de vendas" />
    <p>Com base no gráfico apresentado, qual das seguintes afirmações está correta?</p>`,

    `<h3>Leia o código a seguir:</h3>
    <pre><code>
function processData(data) {
  let result = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] > 10) {
      result += data[i];
    }
  }
  return result;
}
    </code></pre>
    <p>O que este código faz?</p>`,

    `<h3>Considere o seguinte cenário:</h3>
    <p>Você precisa analisar um conjunto de dados com informações de clientes. Os dados incluem:</p>
    <ul>
      <li>Nome do cliente</li>
      <li>Data da compra</li>
      <li>Valor da compra</li>
      <li>Categoria do produto</li>
    </ul>
    <p>Qual seria a melhor abordagem para visualizar a distribuição de compras por categoria?</p>`,

    `<h3>Analise a seguinte consulta SQL:</h3>
    <pre><code>
SELECT 
  department,
  COUNT(*) as employee_count,
  AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY avg_salary DESC;
    </code></pre>
    <p>O que esta consulta retorna?</p>`,
  ]

  // Selecionar um template aleatório
  return richTextTemplates[index % richTextTemplates.length]
}

async function main() {
  console.log("🌱 Iniciando seed de dados...")

  // Criar usuário administrador
  const adminPassword = await hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  })
  console.log("👤 Usuário administrador criado:", admin.email)

  // Criar usuários normais
  const userPassword = await hash("user123", 10)
  const users = [
    { name: "João Silva", email: "joao@example.com" },
    { name: "Maria Oliveira", email: "maria@example.com" },
    { name: "Pedro Santos", email: "pedro@example.com" },
    { name: "Ana Costa", email: "ana@example.com" },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: userPassword,
        role: "USER",
      },
    })
  }
  console.log(`👥 ${users.length} usuários normais criados`)

  // Criar disciplinas
  const subjects = [
    { name: "Excel", slug: "excel", color: "bg-emerald-50 text-emerald-600" },
    { name: "PowerBI", slug: "powerbi", color: "bg-amber-50 text-amber-600" },
    { name: "SQL", slug: "sql", color: "bg-blue-50 text-blue-600" },
    { name: "Python", slug: "python", color: "bg-purple-50 text-purple-600" },
  ]

  const createdSubjects = []
  for (const subject of subjects) {
    const createdSubject = await prisma.subject.upsert({
      where: { slug: subject.slug },
      update: {},
      create: subject,
    })
    createdSubjects.push(createdSubject)
  }
  console.log(`📚 ${createdSubjects.length} disciplinas criadas`)

  // Criar testes para cada disciplina
  const levels = ["INICIANTE", "INTERMEDIARIO", "AVANCADO", "EXPERT"]
  const createdTests = []

  for (const subject of createdSubjects) {
    for (const level of levels) {
      const test = await prisma.test.create({
        data: {
          title: `Teste de ${subject.name} - ${level.charAt(0) + level.slice(1).toLowerCase()}`,
          slug: `teste-${subject.slug}-${level.toLowerCase()}`,
          level: level as any,
          description: `Este é um teste de ${subject.name} para o nível ${level.charAt(0) + level.slice(1).toLowerCase()}`,
          timeLimit: 1200, // 20 minutos
          subjectId: subject.id,
        },
      })
      createdTests.push(test)
    }
  }
  console.log(`📝 ${createdTests.length} testes criados`)

  // Criar questões para cada teste
  for (const test of createdTests) {
    // Criar 5 questões para cada teste
    for (let i = 1; i <= 5; i++) {
      const richTextContent = generateRichTextQuestion(i - 1, test.title.split(" - ")[0].replace("Teste de ", ""))

      const question = await prisma.question.create({
        data: {
          order: i,
          text: richTextContent,
          testId: test.id,
          options: {
            create: [
              { text: "Primeira opção de resposta", order: "a", isCorrect: i === 1 },
              { text: "Segunda opção de resposta", order: "b", isCorrect: i === 2 },
              { text: "Terceira opção de resposta", order: "c", isCorrect: i === 3 },
              { text: "Quarta opção de resposta", order: "d", isCorrect: i === 4 },
              { text: "Quinta opção de resposta", order: "e", isCorrect: i === 5 },
            ],
          },
        },
      })
    }
  }
  console.log(`❓ Questões criadas para todos os testes`)

  // Criar leads
  const leads = [
    { name: "Roberto Almeida", email: "roberto@example.com", phone: "(11) 98765-4321" },
    { name: "Carla Mendes", email: "carla@example.com", phone: "(21) 99876-5432" },
    { name: "Fernando Souza", email: "fernando@example.com", phone: "(31) 97654-3210" },
    { name: "Juliana Lima", email: "juliana@example.com", phone: "(41) 96543-2109" },
    { name: "Marcos Pereira", email: "marcos@example.com", phone: "(51) 95432-1098" },
    { name: "Patrícia Santos", email: "patricia@example.com", phone: "(61) 94321-0987" },
    { name: "Ricardo Oliveira", email: "ricardo@example.com", phone: "(71) 93210-9876" },
    { name: "Camila Costa", email: "camila@example.com", phone: "(81) 92109-8765" },
    { name: "Gabriel Silva", email: "gabriel@example.com", phone: "(91) 91098-7654" },
    { name: "Luciana Martins", email: "luciana@example.com", phone: "(12) 90987-6543" },
  ]

  for (const lead of leads) {
    await prisma.lead.create({
      data: lead,
    })
  }
  console.log(`📊 ${leads.length} leads criados`)

  // Criar alguns resultados de testes
  const userEmails = users.map((user) => user.email)
  const userIds = await prisma.user.findMany({
    where: {
      email: {
        in: userEmails,
      },
    },
    select: {
      id: true,
    },
  })

  for (const userId of userIds) {
    // Cada usuário faz 2 testes aleatórios
    const randomTests = createdTests.sort(() => 0.5 - Math.random()).slice(0, 2)

    for (const test of randomTests) {
      // Buscar questões do teste
      const questions = await prisma.question.findMany({
        where: {
          testId: test.id,
        },
        include: {
          options: true,
        },
      })

      // Criar um teste do usuário
      const userTest = await prisma.userTest.create({
        data: {
          userId: userId.id,
          testId: test.id,
          score: Math.random() * 10, // Pontuação aleatória entre 0 e 10
          finishedAt: new Date(),
        },
      })

      // Criar respostas para cada questão
      for (const question of questions) {
        // Escolher uma opção aleatória
        const randomOption = question.options[Math.floor(Math.random() * question.options.length)]

        await prisma.userAnswer.create({
          data: {
            userTestId: userTest.id,
            questionId: question.id,
            optionId: randomOption.id,
          },
        })
      }
    }
  }
  console.log(`✅ Resultados de testes criados`)

  console.log("✅ Seed concluído com sucesso!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
