import { PrismaClient, Role, Level, Subject } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Criação de usuários
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        image: faker.image.avatar(),
        role: Role.SELLER,
      },
    });
  }

  // Criação de leads
  for (let i = 0; i < 20; i++) {
    await prisma.lead.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      },
    });
  }

  // Criação de testes com perguntas
  const subjects: Subject[] = ['excel', 'powerbi', 'python', 'sql'];
  const levels: Level[] = ['fundamental', 'essencial', 'avancado'];

  for (const subject of subjects) {
    const test = await prisma.test.create({
      data: {
        subject,
        level: Level.fundamental, // apenas um valor de referência
        description: faker.lorem.sentence(),
        color: faker.color.rgb(),
        timeLimit: 1200,
        isActive: true,
      },
    });

    let questionOrder = 1;

    for (const level of levels) {
      for (let i = 0; i < 3; i++) {
        const question = await prisma.question.create({
          data: {
            order: questionOrder++,
            text: `<p><strong>${faker.lorem.sentence()}</strong><br><em>${faker.lorem.paragraph()}</em></p>`,
            testId: test.id,
          },
        });

        const optionsLabels = ['a', 'b', 'c', 'd', 'e'];
        const correctIndex = Math.floor(Math.random() * 5);

        for (let j = 0; j < 5; j++) {
          await prisma.option.create({
            data: {
              text: faker.lorem.words(3),
              order: optionsLabels[j],
              isCorrect: j === correctIndex,
              questionId: question.id,
            },
          });
        }
      }
    }
  }

  console.log('✅ Seed finalizado com sucesso.');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar seed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
