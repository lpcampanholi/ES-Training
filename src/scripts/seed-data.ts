import { PrismaClient, Subject, Level } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

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
    <img src="https://www.researchgate.net/publication/286627726/figure/fig5/AS:648615957651474@1531653503405/Figura-5-Grafico-de-desempenho-das-Vendas-Fonte-Autor-2012.png" height="200px" alt="Gráfico de vendas" />
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

  return richTextTemplates[index % richTextTemplates.length]
}

function generateOptions() {
  const values = [0.0, 4.0, 7.0, 10.0]
  const options = [
    {
      text: "<p>Esta é a resposta totalmente correta.</p>",
      value: 10.0,
    },
  ]
  const usedValues = [10.0]

  for (let i = 0; i < 3; i++) {
    let value
    do {
      value = values[Math.floor(Math.random() * values.length)]
    } while (usedValues.includes(value))
    usedValues.push(value)

    let text = ""
    if (value === 0.0) {
      text = "<p>Esta resposta está totalmente errada.</p>"
    } else if (value === 4.0) {
      text = "<p>Esta resposta está parcialmente correta, mas tem falhas importantes.</p>"
    } else if (value === 7.0) {
      text = "<p>Esta resposta está quase correta, mas tem pequenos erros.</p>"
    }

    options.push({ text, value })
  }

  return options.sort(() => Math.random() - 0.5)
}

async function main() {
  console.log("🌱 Iniciando seed de dados...")

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

  const userPassword = await hash("user123", 10)
  const users = [
    { name: "João Silva", email: "joao@example.com" },
    { name: "Maria Oliveira", email: "maria@example.com" },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: userPassword,
        role: "SELLER",
      },
    })
  }
  console.log(`👥 ${users.length} usuários normais criados`)

  const subjects: Subject[] = ["excel", "powerbi", "sql", "python"]
  const levels: Level[] = ["fundamental", "essencial", "avancado", "profissional"]

  let questionCount = 0

  for (const subject of subjects) {
    for (const level of levels) {
      for (let i = 0; i < 10; i++) {
        const questionText = generateRichTextQuestion(i, subject)
        const options = generateOptions()

        await prisma.question.create({
          data: {
            text: questionText,
            subject,
            level,
            options: {
              create: options.map((opt) => ({
                text: opt.text,
                value: opt.value,
              })),
            },
          },
        })

        questionCount++
      }
    }
  }
  console.log(`❓ ${questionCount} questões criadas`)

  const leads = [
    { name: "Roberto Almeida", email: "roberto@example.com", phone: "(11) 98765-4321" },
    { name: "Carla Mendes", email: "carla@example.com", phone: "(21) 99876-5432" },
    { name: "Fernando Souza", email: "fernando@example.com", phone: "(31) 97654-3210" },
  ]

  for (const lead of leads) {
    await prisma.lead.create({ data: lead })
  }
  console.log(`📊 ${leads.length} leads criados`)

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
