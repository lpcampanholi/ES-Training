import prisma from "@/lib/prisma";
import { Level, Subject } from "@prisma/client";

export async function updateLeadAfterTest(testId: string, level: Level, subject: string, score: number) {
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: { lead: true },
  });

  if (test?.leadId && test.lead) {
    const updatedLead = await prisma.lead.update({
      where: { id: test.leadId },
      data: {
        testLevel: level,
        testSubject: subject as Subject,
        fromTest: true,
        stage: "PENDENTE",
        observations: `Teste finalizado com nota ${score.toFixed(1).replace(".", ",")}`,
      },
    });

    const SELLER_PHONE = '554499694301';

    // Joelson = 554192072269
    // Marcela = 554499694301
    const phone = updatedLead.phone?.replace(/\D/g, "");

    if (phone) {
      const whatsappLink = `https://wa.me/${SELLER_PHONE}`;
      const formattedScore = score.toFixed(1).replace(".", ",");

      // Mensagem para o vendedor
      const sellerMessage = {
        chatId: `${SELLER_PHONE}@c.us`,
        text: `📩 *Novo lead finalizou o teste!*

        👤 *Nome:* ${updatedLead.name}
        📧 *Email:* ${updatedLead.email}
        📱 *Telefone:* ${updatedLead.phone}
        🔗 *WhatsApp:* ${whatsappLink}

        📚 *Disciplina:* ${subject}
        🎯 *Nível sugerido:* ${level}
        📝 *Nota:* ${formattedScore}

        ⚡ Acesse o link acima para iniciar a conversa com o lead.`,
        session: "default",
        linkPreview: false,
        linkPreviewHighQuality: false,
        reply_to: null,
      };

      // Mensagem para o lead
      const userMessage = {
        chatId: `${SELLER_PHONE}@c.us`,
        text: `✅ Olá *${updatedLead.name}*!

        Parabéns por concluir o seu teste na *Excel Solutions*! 🎉

        📝 Sua nota foi *${formattedScore}* em *${subject}*.
        🎯 Seu nível recomendado é: *${level}*

        📞 Em breve, um de nossos consultores vai entrar em contato com você para te mostrar o melhor caminho de estudos. 💡

        Obrigado por confiar na Excel Solutions! 💙`,
        session: "default",
        linkPreview: false,
        linkPreviewHighQuality: false,
        reply_to: null,
      };

      try {
        // Enviar para o vendedor
        await fetch("http://localhost:3001/api/sendText", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(sellerMessage),
        });

        // Enviar para o lead
        await fetch("http://localhost:3001/api/sendText", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(userMessage),
        });

      } catch (wahaError) {
        console.error("Erro ao enviar mensagens via WAHA:", wahaError);
      }
    }
  }
}